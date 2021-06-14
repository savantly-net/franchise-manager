package net.savantly.sprout.franchise.domain.addressbook;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.MapKeyColumn;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Table(name = "fm_address_book")
public class AddressBookEntry extends TenantKeyedEntity {
	
	@ElementCollection
    @MapKeyColumn(name="name")
    @Column(name="value")
    @CollectionTable(name="address_book_attributes", joinColumns = { @JoinColumn(name = "tenant_id"),
			@JoinColumn(name = "item_id") })
    Map<String, String> attributes = new HashMap<String, String>(); // maps from attribute name to value

}
