package net.savantly.sprout.franchise.domain.vendor;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.domain.PersistedDomainObject;


@Getter @Setter
@Entity
@Table(name = "fm_vendor")
@Accessors(chain = true)
public class VendorEntity extends PersistedDomainObject {
    
    @Size(max = 255)
    private String name;
    @Size(max = 20)
    private String phoneNumber;
    @Size(max = 255)
    private String mailingAddress;
    @Size(max = 42)
    private String typeId;
    @Size(max = 255)
    private String emailAddress;
    @Size(max = 2000)
    private String notes;
}
