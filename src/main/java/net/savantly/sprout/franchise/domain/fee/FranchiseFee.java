package net.savantly.sprout.franchise.domain.fee;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;
import net.savantly.sprout.franchise.domain.feeType.FranchiseFeeType;

@Entity
@Getter @Setter
@Table(name = "fm_fee")
@Accessors(chain = true)
public class FranchiseFee extends TenantKeyedEntity {

	private String locationId;
	@ManyToOne
	private FranchiseFeeType feeType;
	private LocalDate startDate;
	private LocalDate endDate;
	
	@Column(precision = 15, scale = 6)
	private BigDecimal overrideAmount;
	private String storeId;
	
	@Transient
	public BigDecimal getAmount() {
		if (Objects.nonNull(overrideAmount)) {
			return overrideAmount;
		} else if (Objects.nonNull(feeType)) {
			return feeType.getDefaultAmount();
		} else {
			return new BigDecimal(0);
		}
	}
	
	@Transient
	public boolean hasCustomAmount() {
		return Objects.nonNull(overrideAmount);
	}
}
