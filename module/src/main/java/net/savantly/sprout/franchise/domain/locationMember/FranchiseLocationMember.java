package net.savantly.sprout.franchise.domain.locationMember;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Accessors(chain = true)
@Getter @Setter
@Table(name = "fm_location_member")
public class FranchiseLocationMember extends TenantKeyedEntity {

	private String locationId;
	private String userId;
	private String role;
}
