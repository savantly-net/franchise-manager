package net.savantly.sprout.franchise.domain.ownership;

import java.time.ZonedDateTime;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Table(name = "fm_owner")
public class FranchiseOwnership extends TenantKeyedEntity {

	private String incorporatedName;
	private long storeId;
	private String locationId;
	private String groupId;
	private ZonedDateTime startDate;
	private ZonedDateTime endDate;
}
