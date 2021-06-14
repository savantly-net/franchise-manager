package net.savantly.sprout.franchise.domain.operations.qai.section;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Accessors(chain = true)
@Getter
@Setter
@Table(name = "fm_qai_section")
public class QAISection extends TenantKeyedEntity {

	private String name;
	@Column(name = "item_order")
	private int order;
	private boolean requireStaffAttendance;
}
