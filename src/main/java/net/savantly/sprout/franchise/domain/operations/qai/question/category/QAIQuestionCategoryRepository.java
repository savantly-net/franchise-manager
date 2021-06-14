package net.savantly.sprout.franchise.domain.operations.qai.question.category;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;

public interface QAIQuestionCategoryRepository extends TenantKeyedRepository<QAIQuestionCategory>{

	QAIQuestionCategory findByName(String name);
}
