package net.savantly.sprout.franchise.domain.hours;

import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Getter @Setter
public class FranchiseHoursOfOperationDto {

	private String id;
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
