package net.savantly.sprout.franchise.domain.vendorType;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.domain.PersistedDomainObject;

@Getter @Setter
@Entity
@Table(name = "fm_vendor_type")
@Accessors(chain = true)
public class VendorTypeEntity extends PersistedDomainObject {
    
    private String name;
}
