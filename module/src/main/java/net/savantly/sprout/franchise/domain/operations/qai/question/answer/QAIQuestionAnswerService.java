package net.savantly.sprout.franchise.domain.operations.qai.question.answer;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.core.tenancy.TenantedPrimaryKey;

@RequiredArgsConstructor
@Transactional
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
			Optional<QAIQuestionAnswer> optional = repo.findByIdItemId(a.getItemId());
			if (optional.isPresent()) {
				entity = optional.get();
			} else {
				entity = new QAIQuestionAnswer();
				TenantedPrimaryKey id = new TenantedPrimaryKey();
				id.setItemId(a.getItemId());
				entity.setId(id );
			}
		} else {
			entity = new QAIQuestionAnswer();
		}
		entity
			.setNotes(a.getNotes())
			.setQuestionId(a.getQuestionId())
			.setValue(a.getValue())
			.setAttachments(a.getAttachments());
		//repo.save(entity);
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
