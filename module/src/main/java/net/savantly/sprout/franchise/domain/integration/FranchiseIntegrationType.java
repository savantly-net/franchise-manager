package net.savantly.sprout.franchise.domain.integration;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Table(name = "fm_integration_type")
public class FranchiseIntegrationType extends TenantKeyedEntity {

	private boolean enabled;
	private String displayName;
	private String description;
}
