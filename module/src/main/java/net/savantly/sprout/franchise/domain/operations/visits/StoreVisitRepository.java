package net.savantly.sprout.franchise.domain.operations.visits;

import java.util.List;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;

public interface StoreVisitRepository extends TenantKeyedRepository<StoreVisit> {

	List<StoreVisit> findByLocationId(String locationId);
	
	List<StoreVisit> findBySectionSubmissionId(String sectionSubmissionId);
}
