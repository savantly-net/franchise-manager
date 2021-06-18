package net.savantly.sprout.franchise.domain.hours;

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
@Table(name = "fm_operating_hours")
public class FranchiseHoursOfOperation extends TenantKeyedEntity {

	private LocalTime sundayOpen;
	private LocalTime sundayClose;
	private LocalTime mondayOpen;
	private LocalTime mondayClose;
	private LocalTime tuesdayOpen;
	private LocalTime tuesdayClose;
	private LocalTime wednesdayOpen;
	private LocalTime wednesdayClose;
	private LocalTime thursdayOpen;
	private LocalTime thursdayClose;
	private LocalTime fridayOpen;
	private LocalTime fridayClose;
	private LocalTime saturdayOpen;
	private LocalTime saturdayClose;
}
