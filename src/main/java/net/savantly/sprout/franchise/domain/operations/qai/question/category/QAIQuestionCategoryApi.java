package net.savantly.sprout.franchise.domain.operations.qai.question.category;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.rest.crud.TenantedDtoController;

@RestController
@RequestMapping("/api/fm/qai/question/category")
public class QAIQuestionCategoryApi extends TenantedDtoController<QAIQuestionCategory, QAIQuestionCategory> {

	public QAIQuestionCategoryApi(TenantKeyedRepository<QAIQuestionCategory> repository) {
		super(repository);
	}

	@Override
	protected QAIQuestionCategory convert(QAIQuestionCategory object) {
		return object;
	}

	@Override
	protected QAIQuestionCategory createEntity(QAIQuestionCategory object) {
		return object;
	}

	@Override
	protected QAIQuestionCategory updateEntity(QAIQuestionCategory entity, QAIQuestionCategory object) {
		return object;
	}

}
