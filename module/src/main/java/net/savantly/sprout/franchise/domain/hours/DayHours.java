package net.savantly.sprout.franchise.domain.hours;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class DayHours {

	@JsonProperty("isClosed")
	private boolean closed;
	private List<HourInterval> openIntervals = new ArrayList<>();
}
