package net.savantly.sprout.franchise.domain.posownership;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Table(name = "fm_owner_pos")
public class PosOwnership extends TenantKeyedEntity {

	private String storeId;
	private String posId;
	private LocalDate startDate;
	private LocalDate endDate;
}
