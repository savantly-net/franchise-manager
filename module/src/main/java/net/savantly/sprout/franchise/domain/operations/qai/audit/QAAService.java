package net.savantly.sprout.franchise.domain.operations.qai.audit;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.savantly.sprout.franchise.domain.operations.qai.score.QAAScoreDto;
import net.savantly.sprout.franchise.domain.operations.qai.score.QAAScoreService;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISectionSubmissionDto;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISubmissionService;

@Slf4j
@RequiredArgsConstructor
public class QAAService {

	final QAISubmissionService qaiSubmissionService;
	final QAASubmissionRepository repository;
	final QAAScoreService scoreService;
	
	public Page<QAASummaryDto> getPage(Pageable pageable) {
		return this.repository.findAll(pageable).map(q -> convertToSummary(q));
	}

	private QAASummaryDto convertToSummary(QAASubmission q) {
		return new QAASummaryDto()
		.setDateScored(q.getDateScored())
		.setEndTime(q.getTimeEnd())
		.setFsc(q.getFsc())
		.setFsm(q.getFsm())
		.setId(q.getId())
		.setLocationId(q.getLocationId())
		.setManagerOnDuty(q.getManagerOnDuty())
		.setResponsibleAlcoholCert(q.getResponsibleAlcoholCert())
		.setStartTime(q.getTimeStart());
	}

	public QAADto getOneById(String id) {
		log.info("finding QAAScore by id: {}", id);
		return convert(this.repository.findById(id).orElseThrow());
	}
	
	public QAADto save(QAADto dto) {
		Set<String> sectionSubmissionIds = saveSectionSubmissions(dto);
		QAASubmission entity = convert(dto);
		entity.setSectionSubmissionIds(sectionSubmissionIds);
		QAASubmission saved = this.repository.save(entity);
		QAADto result = convert(saved);
		QAAScoreDto scoreDto = this.scoreService.createScoreFromSubmission(saved, result.getSections().stream().collect(Collectors.toList()));
		
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
		entity.setDateScored(dto.getDateScored().atTime(dto.getStartTime()))
			.setFsc(dto.getFsc())
			.setFsm(dto.getFsm())
			.setLocationId(dto.getLocationId())
			.setManagerOnDuty(dto.getManagerOnDuty())
			.setResponsibleAlcoholCert(dto.getResponsibleAlcoholCert())
			.setTimeStart(dto.getStartTime())
			.setTimeEnd(dto.getEndTime());
		dto.getSections().forEach(s -> {
			if (Objects.nonNull(s.getItemId())) {
				entity.sectionSubmissionIds.add(s.getItemId());
			}
		});
		return entity;
	}
	
	private QAADto convert(QAASubmission entity) {
		QAADto dto = new QAADto()
			.setId(entity.getId())
			.setDateScored(entity.getDateScored().toLocalDate())
			.setFsc(entity.getFsc())
			.setFsm(entity.getFsm())
			.setLocationId(entity.getLocationId())
			.setManagerOnDuty(entity.getManagerOnDuty())
			.setResponsibleAlcoholCert(entity.getResponsibleAlcoholCert())
			.setEndTime(entity.getTimeEnd())
			.setStartTime(entity.getTimeStart());
		
		ArrayList<QAISectionSubmissionDto> sections = new ArrayList<QAISectionSubmissionDto>();
		entity.getSectionSubmissionIds().forEach(s -> {
			if (Objects.nonNull(s)) {
				sections.add(qaiSubmissionService.findByItemId(s).orElseThrow());
			}
		});
		dto.setSections(sections.stream().sorted(Comparator.comparingInt(QAISectionSubmissionDto::getOrder)).collect(Collectors.toSet()));
		return dto;
	}

	private QAASubmission getOrCreateEntity(QAADto dto) {
		if (Objects.isNull(dto.getId())) {
			return createNewEntity();
		} else {
			return this.repository.findById(dto.getId()).orElse(createNewEntity().setId(dto.getId()));
		}
	}

	private QAASubmission createNewEntity() {
		QAASubmission entity = new QAASubmission();
		entity.setId(UUID.randomUUID().toString());
		return entity;
	}

}
