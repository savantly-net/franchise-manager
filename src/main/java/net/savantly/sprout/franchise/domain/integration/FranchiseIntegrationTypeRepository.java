package net.savantly.sprout.franchise.domain.integration;

import net.savantly.sprout.core.tenancy.TenantedJpaRepository;
import net.savantly.sprout.core.tenancy.TenantedPrimaryKey;

public interface FranchiseIntegrationTypeRepository extends TenantedJpaRepository<FranchiseIntegrationType, TenantedPrimaryKey> {

}
