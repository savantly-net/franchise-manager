package net.savantly.sprout.franchise.domain.operations.qai.question;

import java.util.List;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;

public interface QAIQuestionRepository extends TenantKeyedRepository<QAIQuestion> {

	List<QAIQuestion> findBySectionId(String sectionId);
}
