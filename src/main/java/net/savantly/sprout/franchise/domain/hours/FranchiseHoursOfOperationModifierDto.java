package net.savantly.sprout.franchise.domain.hours;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Getter @Setter
public class FranchiseHoursOfOperationModifierDto {

	private String id;
	private LocalDate dateToModify;
	private LocalTime openTime;
	private LocalTime closeTime;

}
