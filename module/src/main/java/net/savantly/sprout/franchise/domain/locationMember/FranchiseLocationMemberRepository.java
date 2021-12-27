package net.savantly.sprout.franchise.domain.locationMember;

import java.util.List;

import org.springframework.data.repository.query.Param;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;

public interface FranchiseLocationMemberRepository extends TenantKeyedRepository<FranchiseLocationMember> {

	List<FranchiseLocationMember> findByLocationId(@Param("locationId") String locationId);

	List<FranchiseLocationMember> findByUserId(@Param("userId") String userId);

}
