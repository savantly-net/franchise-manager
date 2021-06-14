package net.savantly.sprout.franchise.domain.feeType;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Table(name = "fm_fee_type")
public class FranchiseFeeType extends TenantKeyedEntity {

	private String name;
	private String description;
	private boolean recurring;
	@Enumerated(EnumType.STRING)
	private FeeRecurringInterval recurringInterval;
	private BigDecimal defaultAmount;
	@Enumerated(EnumType.STRING)
	private FeeAmountType feeAmountType;
	private boolean deleted;
	private boolean enabled;
	@Enumerated(EnumType.STRING)
	private FeeAssignmentType assignmentType;
}
