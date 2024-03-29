package net.savantly.sprout.franchise.domain.location;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;

import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;
import net.savantly.sprout.franchise.domain.bar.FranchiseBar;
import net.savantly.sprout.franchise.domain.building.FranchiseBuilding;
import net.savantly.sprout.franchise.domain.hours.FranchiseHoursOfOperationModifier;
import net.savantly.sprout.franchise.domain.hours.LocationHours;
import net.savantly.sprout.franchise.domain.locationOpenDateInterval.LocationOpenDateInterval;
import net.savantly.sprout.franchise.domain.patio.FranchisePatio;
import net.savantly.sprout.franchise.domain.pos.FranchisePOS;

@Entity
@Getter @Setter
@Accessors(chain = true)
@Table(name = "fm_location")
@TypeDefs({
    @TypeDef(name = "json", typeClass = JsonBinaryType.class)
})
public class FranchiseLocation extends TenantKeyedEntity  {

	@Size(max = 100)
	@Column(length = 100)
	private String name;
	
	@Size(max = 100)
	@Column(length = 100)
	private String country;
	
	@Size(max = 100)
	@Column(length = 100)
	private String address1;
	
	@Size(max = 100)
	@Column(length = 100)
	private String address2;
	
	@Size(max = 100)
	@Column(length = 100)
	private String city;
	
	@Size(max = 100)
	@Column(length = 100)
	private String state;
	
	@Size(max = 20)
	@Column(length = 20)
	private String zip;
	
	@Enumerated(EnumType.STRING)
	private LocationConcept concept;
	
	@Enumerated(EnumType.STRING)
	private LocationType locationType;

	private String smallWare;
	private String kes;
	private String realEstateType;
	private String stage;
	private String distributionCenter;
	private String training;

	@Size(max = 100)
	@Column(length = 100)
	private String marketId;

	private LocalDate dateOpened;
	private LocalDate dateClosed;

	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private Set<LocationOpenDateInterval> openDateIntervals = new HashSet<>();
	
	private String phoneNumber;

	@Size(max = 100)
	@Column(length = 100)
	private String emailAddress;
	
	private ZonedDateTime onlineOrderingStartDate;

	@Size(max = 255)
	@Column(length = 255)
	private String notes;

	@Type(type = "json")
	@Column(columnDefinition = "jsonb")
	private LocationHours hours;
	
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private Set<FranchiseBar> bars = new HashSet<>();

	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private Set<FranchisePatio> patios = new HashSet<>();
	
	@OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private FranchiseBuilding building;

	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private Set<FranchiseHoursOfOperationModifier> modifiedHours = new HashSet<>();

	@OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private FranchisePOS pos;
}

