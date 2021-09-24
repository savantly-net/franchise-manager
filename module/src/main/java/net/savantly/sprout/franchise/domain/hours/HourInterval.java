package net.savantly.sprout.franchise.domain.hours;

import java.time.LocalTime;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class HourInterval {

	private LocalTime start;
	private LocalTime end;
}
