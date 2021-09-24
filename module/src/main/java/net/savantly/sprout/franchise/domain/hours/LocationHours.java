package net.savantly.sprout.franchise.domain.hours;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(content = JsonInclude.Include.NON_EMPTY)
public class LocationHours {

	private DayHours sunday;
	private DayHours monday;
	private DayHours tuesday;
	private DayHours wednesday;
	private DayHours thursday;
	private DayHours friday;
	private DayHours saturday;
	
	private List<HolidayHoursItem> holidayHours = new ArrayList<>();

}
