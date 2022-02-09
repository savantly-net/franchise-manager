package net.savantly.sprout.franchise.domain.locationOpenDateInterval;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Accessors(chain = true)
@Table(name = "fm_location_open_dates")
public class LocationOpenDateInterval  extends TenantKeyedEntity {
    private LocalDate start;
	private LocalDate end;
}
