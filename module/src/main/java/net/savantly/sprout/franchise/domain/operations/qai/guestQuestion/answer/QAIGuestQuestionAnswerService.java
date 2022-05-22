package net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answer;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.core.tenancy.TenantContext;
import net.savantly.sprout.core.tenancy.TenantedPrimaryKey;

@RequiredArgsConstructor
public class QAIGuestQuestionAnswerService {

	private final QAIGuestQuestionAnswerRespository repository;

	public List<QAIGuestQuestionAnswerDto> convert(List<QAIGuestQuestionAnswer> answers) {
		List<QAIGuestQuestionAnswerDto> result = new ArrayList<>();
		answers.forEach(a -> {
			result.add(new QAIGuestQuestionAnswerDto()
					.setGuestQuestionId(a.getGuestQuestionId())
					.setItemId(a.getItemId())
					.setValue(a.getValue()));
		});
		return result;
	}

	public List<QAIGuestQuestionAnswer> upsert(List<QAIGuestQuestionAnswerDto> answers) {
		final List<QAIGuestQuestionAnswer> result = new ArrayList<>();
		answers.forEach(a -> {
			QAIGuestQuestionAnswer entity = null;
			if (Objects.nonNull(a.getItemId())) {
				entity = repository.findByIdItemId(a.getItemId())
						.orElse(new QAIGuestQuestionAnswer());
				TenantedPrimaryKey key = new TenantedPrimaryKey();
				key.setTenantId(TenantContext.getCurrentTenant());
				key.setItemId(a.getItemId());
				entity.setId(key);
			} else {
				entity = new QAIGuestQuestionAnswer();
			}
			entity.setValue(a.getValue())
					.setGuestQuestionId(a.getGuestQuestionId());
			result.add(entity);
		});
		repository.saveAll(result);
		return result;
	}

}
