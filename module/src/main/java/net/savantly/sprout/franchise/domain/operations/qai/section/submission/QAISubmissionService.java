package net.savantly.sprout.franchise.domain.operations.qai.section.submission;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answerGroup.QAIGuestQuestionAnswerGroupService;
import net.savantly.sprout.franchise.domain.operations.qai.question.answer.QAIQuestionAnswerService;
import net.savantly.sprout.franchise.domain.operations.qai.section.QAISectionService;

@RequiredArgsConstructor
public class QAISubmissionService {

	private final static Logger log = LoggerFactory.getLogger(QAISubmissionService.class);
	private final QAISectionSubmissionRepository repository;
	private final QAIQuestionAnswerService qaService;
	private final QAIGuestQuestionAnswerGroupService gqaService;
	private final QAISectionService sectionService;
	
	public QAISectionSubmissionDto upsertEntity(QAISectionSubmissionDto object) {
		if (Objects.isNull(object.getItemId())) {
			return convert(updateEntity(new QAISectionSubmission(), object));
		} else {
			QAISectionSubmission entity = this.repository.findByIdItemId(object.getItemId()).orElse(new QAISectionSubmission());
			updateEntity(entity, object);
			return convert(entity);
		}
		
	}
	
	public QAISectionSubmission createEntity(QAISectionSubmissionDto object) {
		return updateEntity(new QAISectionSubmission(), object);
	}

	public QAISectionSubmission updateEntity(QAISectionSubmission entity, QAISectionSubmissionDto object) {
		entity
			.setLocationId(object.getLocationId())
			.setSectionId(object.getSectionId())
			.setAnswers(qaService.upsert(object.getAnswers()))
			.setDateScored(ZonedDateTime.now())
			.setGuestAnswers(gqaService.upsert(object.getGuestAnswers()))
			.setManagerOnDuty(object.getManagerOnDuty())
			.setStaffAttendance(object.getStaffAttendance())
			.setStatus(object.getStatus());
		return this.repository.save(entity);
	}

	public QAISectionSubmissionDto convert(QAISectionSubmission entity) {
		QAISectionSubmissionDto dto = new QAISectionSubmissionDto();
		dto.setItemId(entity.getItemId());
		dto.setOrder(sectionService.findByItemId(entity.getSectionId()).getOrder());
		return dto.setAnswers(qaService.convert(entity.getAnswers()))
				.setLocationId(entity.getLocationId())
				.setSectionId(entity.getSectionId())
				.setDateScored(entity.getDateScored())
				.setGuestAnswers(gqaService.convert(entity.getGuestAnswers()))
				.setItemId(entity.getItemId())
				.setManagerOnDuty(entity.getManagerOnDuty())
				.setStaffAttendance(entity.getStaffAttendance())
				.setStatus(entity.getStatus());
	}
	
	public Optional<QAISectionSubmissionDto> findByItemId(String itemId) {
		return this.repository.findByIdItemId(itemId).map(s -> this.convert(s));
	}

	public List<QAISectionSubmissionDto> findByLocation(String locationId) {
		log.debug("find submissions by locationId {}", locationId);
		return repository.findByLocationId(locationId).stream().map(q -> convert(q)).collect(Collectors.toList());
	}
}
