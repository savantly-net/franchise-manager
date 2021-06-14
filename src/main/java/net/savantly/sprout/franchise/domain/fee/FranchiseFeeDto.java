package net.savantly.sprout.franchise.domain.fee;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
public class FranchiseFeeDto {
	private String itemId;
	private String locationId;
	private String storeId;
	private String feeTypeId;
	private LocalDate startDate;
	private LocalDate endDate;
	private BigDecimal overrideAmount;
	
	@JsonProperty(access = Access.READ_ONLY)
	private BigDecimal amount;
	@JsonProperty(access = Access.READ_ONLY)
	private boolean hasCustomAmount;

}
