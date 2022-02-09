package net.savantly.sprout.franchise.domain.locationOpenDateInterval;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter @Setter
@Accessors(chain = true)
public class LocationOpenDateIntervalDto {
    private String id;
    private LocalDate start;
	private LocalDate end;
}
