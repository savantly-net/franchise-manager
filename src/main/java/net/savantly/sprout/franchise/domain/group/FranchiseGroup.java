package net.savantly.sprout.franchise.domain.group;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Table(name = "fm_group")
@Accessors(chain = true)
@JsonIgnoreProperties(ignoreUnknown = true, value = {"createdDate", "lastModifiedDate"})
public class FranchiseGroup extends TenantKeyedEntity {

	private String name;
	private String address1;
	private String address2;
	private String city;
	private String state;
	private String zip;

}
