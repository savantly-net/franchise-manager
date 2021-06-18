package net.savantly.sprout.franchise.domain.pos;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

/**
 * Represents POS terminals at a location.  
 * The itemId is the associated location id
 * @author jeremybranham
 *
 */
@Entity
@Accessors(chain = true)
@Getter @Setter
@Table(name = "fm_pos")
public class FranchisePOS extends TenantKeyedEntity {

	private int physicalTerminals;
	private int virtualTerminals;
}
