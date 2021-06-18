package net.savantly.sprout.franchise.domain.location;

import java.util.HashSet;
import java.util.Set;

import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.franchise.domain.bar.FranchiseBarDto;
import net.savantly.sprout.franchise.domain.building.FranchiseBuildingDto;
import net.savantly.sprout.franchise.domain.hours.FranchiseHoursOfOperationDto;
import net.savantly.sprout.franchise.domain.hours.FranchiseHoursOfOperationModifierDto;
import net.savantly.sprout.franchise.domain.patio.FranchisePatioDto;
import net.savantly.sprout.franchise.domain.pos.FranchisePOSDto;

@Getter @Setter
@Accessors(chain = true)
public class FranchiseLocationDto {
	private String id;
	
	@Size(max = 100)
	private String name;
	
	@Size(max = 100)
	private String country;
	
	@Size(max = 100)
	private String address1;
	
	@Size(max = 100)
	private String address2;
	
	@Size(max = 100)
	private String city;
	
	@Size(max = 100)
	private String state;
	
	@Size(max = 20)
	private String zip;
	
	private LocationConcept concept;
	
	private LocationType locationType;

	@Size(max = 100)
	private String marketId;

	@Size(max = 100)
	private String groupId;
	
	private Long phoneNumber;
	
	private Set<FranchiseBarDto> bars = new HashSet<>();

	private Set<FranchisePatioDto> patios = new HashSet<>();
	
	private FranchiseBuildingDto building;

	private FranchiseHoursOfOperationDto hours;

	private Set<FranchiseHoursOfOperationModifierDto> modifiedHours = new HashSet<>();

	private FranchisePOSDto pos;
}
