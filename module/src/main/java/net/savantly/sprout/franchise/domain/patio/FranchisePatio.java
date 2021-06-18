package net.savantly.sprout.franchise.domain.patio;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Accessors(chain = true)
@Table(name = "fm_patio")
public class FranchisePatio extends TenantKeyedEntity {

	private int totalSquareFeet;
}
