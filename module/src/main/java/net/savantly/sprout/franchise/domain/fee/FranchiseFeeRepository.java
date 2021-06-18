package net.savantly.sprout.franchise.domain.fee;

import java.util.List;

import org.springframework.data.repository.query.Param;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;

public interface FranchiseFeeRepository extends TenantKeyedRepository<FranchiseFee> {

	public List<FranchiseFee> findByLocationId(@Param("locationId") String locationId);
}
