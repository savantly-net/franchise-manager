package net.savantly.sprout.franchise.domain.contact;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Table(name = "fm_contact_type")
public class FranchiseContactType extends TenantKeyedEntity {
	
	private String displayName;
	private boolean enabled;
}
