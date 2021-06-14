package net.savantly.sprout.franchise.domain.bar;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Accessors(chain = true)
@Table(name = "fm_bar")
public class FranchiseBar extends TenantKeyedEntity {

	private boolean standalone;
	private int linearFeet;
	private boolean beer;
	private boolean liquor;
}
