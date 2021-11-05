package net.savantly.sprout.franchise.domain.ownership;

import java.util.List;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;

public interface FranchiseOwnershipRepository extends TenantKeyedRepository<FranchiseOwnership> {

	List<FranchiseOwnership> findByGroupId(String groupId);
	List<FranchiseOwnership> findByLocationId(String locationId);
}
