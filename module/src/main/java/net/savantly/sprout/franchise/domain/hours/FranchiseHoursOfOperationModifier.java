package net.savantly.sprout.franchise.domain.hours;

import java.time.LocalDate;
import java.time.LocalTime;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Accessors(chain = true)
@Getter @Setter
@Table(name = "fm_operating_hours_modifier")
public class FranchiseHoursOfOperationModifier extends TenantKeyedEntity {

	private LocalDate dateToModify;
	private LocalTime openTime;
	private LocalTime closeTime;
}
