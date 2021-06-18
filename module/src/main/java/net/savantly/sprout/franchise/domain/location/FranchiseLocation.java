package net.savantly.sprout.franchise.domain.location;

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

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;
import net.savantly.sprout.franchise.domain.bar.FranchiseBar;
import net.savantly.sprout.franchise.domain.building.FranchiseBuilding;
import net.savantly.sprout.franchise.domain.hours.FranchiseHoursOfOperation;
import net.savantly.sprout.franchise.domain.hours.FranchiseHoursOfOperationModifier;
import net.savantly.sprout.franchise.domain.patio.FranchisePatio;
import net.savantly.sprout.franchise.domain.pos.FranchisePOS;

@Entity
@Getter @Setter
@Accessors(chain = true)
@Table(name = "fm_location")
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

	@Size(max = 100)
	@Column(length = 100)
	private String marketId;

	@Size(max = 100)
	@Column(length = 100)
	private String groupId;
	
	private Long phoneNumber;

	@Size(max = 100)
	@Column(length = 100)
	private String emailAddress;
	
	private ZonedDateTime onlineOrderingStartDate;

	@Size(max = 255)
	@Column(length = 255)
	private String notes;
	
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private Set<FranchiseBar> bars = new HashSet<>();

	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private Set<FranchisePatio> patios = new HashSet<>();
	
	@OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private FranchiseBuilding building;

	@OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private FranchiseHoursOfOperation hours;

	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private Set<FranchiseHoursOfOperationModifier> modifiedHours = new HashSet<>();

	@OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private FranchisePOS pos;
}

