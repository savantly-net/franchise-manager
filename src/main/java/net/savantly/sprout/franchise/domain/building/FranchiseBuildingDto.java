package net.savantly.sprout.franchise.domain.building;

import java.time.LocalDate;
import java.time.ZonedDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter @Setter
@Accessors(chain = true)
public class FranchiseBuildingDto {
	private String id;
	private int totalSquareFeet;
	private int fohSquareFeet;
	private int bohSquareFeet;
	private int maxOccupancy;
	private int maxSeating;
	private LocalDate leaseSignDate;
}
