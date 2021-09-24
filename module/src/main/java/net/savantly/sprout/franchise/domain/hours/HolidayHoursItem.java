package net.savantly.sprout.franchise.domain.hours;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class HolidayHoursItem {

	private LocalDate date;
	@JsonProperty("isClosed")
	private boolean closed;
	@JsonProperty("isRegularHours")
	private boolean regularHours;
	private List<HourInterval> openIntervals = new ArrayList<>();
}
