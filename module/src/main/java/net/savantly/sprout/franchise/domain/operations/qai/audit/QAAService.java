package net.savantly.sprout.franchise.domain.operations.qai.audit;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.franchise.domain.operations.qai.score.QAAScoreService;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISectionSubmissionDto;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISubmissionService;

@RequiredArgsConstructor
public class QAAService {

	final QAISubmissionService qaiSubmissionService;
	final QAASubmissionRepository repository;
	final QAAScoreService scoreService;
	
	public Page<QAADto> getPage(Pageable pageable) {
		return this.repository.findAll(pageable).map(q -> convert(q));
	}

	public QAADto getOneById(String id) {
		return convert(this.repository.findById(id).orElseThrow());
	}
	
	public QAADto save(QAADto dto) {
		Set<String> sectionIds = saveSectionSubmissions(dto);
		QAASubmission entity = convert(dto);
		entity.setSectionIds(sectionIds);
		QAASubmission saved = this.repository.save(entity);
		QAADto result = convert(saved);
		this.scoreService.createScoreFromSubmission(saved, result.getSections().stream().toList());
		return result;
	}
	
	public void delete(String id) {
		this.repository.deleteById(id);
	}

	private Set<String> saveSectionSubmissions(QAADto dto) {
		Set<String> result = new HashSet<>();
		for (QAISectionSubmissionDto sectionDto : dto.getSections()) {
			result.add(this.qaiSubmissionService.upsertEntity(sectionDto).getItemId());
		}
		return result;
	}


	private QAASubmission convert(QAADto dto) {
		QAASubmission entity = getOrCreateEntity(dto);
		entity.setDateScored(dto.getDateScored())
			.setFsc(dto.getFsc())
			.setLocationId(dto.getLocationId())
			.setManagerOnDuty(dto.getManagerOnDuty())
			.setResponsibleAlcoholCert(dto.getResponsibleAlcoholCert());
		dto.getSections().forEach(s -> {
			if (Objects.nonNull(s.getItemId())) {
				entity.sectionIds.add(s.getItemId());
			}
		});
		return entity;
	}
	
	private QAADto convert(QAASubmission entity) {
		QAADto dto = new QAADto()
			.setId(entity.getId())
			.setDateScored(entity.getDateScored())
			.setFsc(entity.getFsc())
			.setLocationId(entity.getLocationId())
			.setManagerOnDuty(entity.getManagerOnDuty())
			.setResponsibleAlcoholCert(entity.getResponsibleAlcoholCert());
		entity.getSectionIds().forEach(s -> {
			if (Objects.nonNull(s)) {
				dto.getSections().add(qaiSubmissionService.findByItemId(s).orElseThrow());
			}
		});
		return dto;
	}

	private QAASubmission getOrCreateEntity(QAADto dto) {
		if (Objects.isNull(dto.getId())) {
			return createNewEntity();
		} else {
			return this.repository.findById(dto.getId()).orElse(createNewEntity());
		}
	}

	private QAASubmission createNewEntity() {
		QAASubmission entity = new QAASubmission();
		entity.setId(UUID.randomUUID().toString());
		return entity;
	}

}
