package net.savantly.sprout.franchise.domain.market;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Table(name = "fm_market")
@JsonIgnoreProperties(ignoreUnknown = true, value = {"createdDate", "lastModifiedDate"})
public class FranchiseMarket extends TenantKeyedEntity {
	
	private String name;

}
