package net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answerGroup;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answer.QAIGuestQuestionAnswer;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answer.QAIGuestQuestionAnswerService;

@RequiredArgsConstructor
public class QAIGuestQuestionAnswerGroupService {
	
	private final QAIGuestQuestionAnswerGroupRepository repository;
	private final QAIGuestQuestionAnswerService gqaService;
	

	public List<QAIGuestQuestionAnswerGroup> upsert(List<QAIGuestQuestionAnswerGroupDto> answers) {
		final List<QAIGuestQuestionAnswerGroup> result = new ArrayList<>();
		answers.forEach(a -> {
			result.add(upsert(a));
		});
		return result;
	}

	public List<QAIGuestQuestionAnswerGroupDto> convert(List<QAIGuestQuestionAnswerGroup> guestAnswers) {
		List<QAIGuestQuestionAnswerGroupDto> result = new ArrayList<>();
		guestAnswers.forEach(a -> {
			result.add(convert(a));
		});
		return result;
	}

	public QAIGuestQuestionAnswerGroup upsert(QAIGuestQuestionAnswerGroupDto questionAnswers) {
		QAIGuestQuestionAnswerGroup entity = null;
		if (Objects.nonNull(questionAnswers.getItemId())) {
			entity = repository.findByIdItemId(questionAnswers.getItemId())
					.orElseThrow(() -> new EntityNotFoundException("A Guest QA Group could not be found with id: " + questionAnswers.getItemId()));
		} else {
			entity = new QAIGuestQuestionAnswerGroup();
		}
		List<QAIGuestQuestionAnswer> guestAnswers = gqaService.upsert(questionAnswers.getAnswers());
		entity.setAnswers(guestAnswers);
		entity.setAttachments(questionAnswers.getAttachments());
		entity.setNotes(questionAnswers.getNotes());
		repository.save(entity);
		return entity;
	}

	public QAIGuestQuestionAnswerGroupDto convert(QAIGuestQuestionAnswerGroup qaEntity) {
		return new QAIGuestQuestionAnswerGroupDto()
			.setAnswers(gqaService.convert(qaEntity.getAnswers()))
			.setItemId(qaEntity.getItemId())
			.setAttachments(qaEntity.getAttachments())
			.setNotes(qaEntity.getNotes());
	}

}
