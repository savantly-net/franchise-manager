package net.savantly.sprout.franchise.domain.operations.qai.guestQuestion;

import java.util.List;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;

public interface QAIGuestQuestionRepository extends TenantKeyedRepository<QAIGuestQuestion> {

	List<QAIGuestQuestion> findBySectionId(String sectionId);

}
