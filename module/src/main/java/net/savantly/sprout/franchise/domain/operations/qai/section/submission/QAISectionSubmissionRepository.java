package net.savantly.sprout.franchise.domain.operations.qai.section.submission;

import java.util.List;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;

public interface QAISectionSubmissionRepository extends TenantKeyedRepository<QAISectionSubmission> {

	List<QAISectionSubmission> findByLocationId(String locationId);
	
}
