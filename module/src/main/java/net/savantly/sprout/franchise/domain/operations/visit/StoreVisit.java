package net.savantly.sprout.franchise.domain.operations.visit;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Table(name = "fm_qai_visit")
@Getter
@Setter
@Accessors(chain = true)
public class StoreVisit extends TenantKeyedEntity {

	private String locationId;
	private String formDataId;
	private String sectionSubmissionId;
}
