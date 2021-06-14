package net.savantly.sprout.franchise.domain.building;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Accessors(chain = true)
@Table(name = "fm_building")
public class FranchiseBuilding extends TenantKeyedEntity {

	private int totalSquareFeet;
	private int fohSquareFeet;
	private int bohSquareFeet;
	private int maxOccupancy;
	private int maxSeating;
	private LocalDate leaseSignDate;
}
