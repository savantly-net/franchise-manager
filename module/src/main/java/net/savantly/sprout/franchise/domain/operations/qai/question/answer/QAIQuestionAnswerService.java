package net.savantly.sprout.franchise.domain.operations.qai.question.answer;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class QAIQuestionAnswerService {
	
	private final QAIQuestionAnswerRepository repo;

	public List<QAIQuestionAnswer> upsert(List<QAIQuestionAnswerDto> answers) {
		final List<QAIQuestionAnswer> result = new ArrayList<>();
		answers.forEach(a -> {
			result.add(upsert(a));
		});
		return result;
	}

	public List<QAIQuestionAnswerDto> convert(List<QAIQuestionAnswer> answers) {
		List<QAIQuestionAnswerDto> result = new ArrayList<>();
		answers.forEach(a -> result.add(convert(a)
		));
		return result;
	}

	public QAIQuestionAnswer upsert(QAIQuestionAnswerDto a) {
		QAIQuestionAnswer entity = null;
		if (Objects.nonNull(a.getItemId())) {
			entity = repo.findByIdItemId(a.getItemId()).orElseThrow(() -> new EntityNotFoundException("A QA could not be found with id: " + a.getItemId()));
		} else {
			entity = new QAIQuestionAnswer();
		}
		entity
			.setNotes(a.getNotes())
			.setQuestionId(a.getQuestionId())
			.setValue(a.getValue())
			.setAttachments(a.getAttachments());
		repo.save(entity);
		return entity;
	}

	public QAIQuestionAnswerDto convert(QAIQuestionAnswer a) {
		return new QAIQuestionAnswerDto()
				.setItemId(a.getItemId())
				.setNotes(a.getNotes())
				.setQuestionId(a.getQuestionId())
				.setValue(a.getValue())
				.setAttachments(a.getAttachments());
	}

}
