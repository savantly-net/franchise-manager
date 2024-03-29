package net.savantly.sprout.franchise.domain.operations.qai.score;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter @Setter
@Accessors(chain = true)
public class QAASectionCategoryScoreDto {

	private String categoryName;
	private long sectionOrder;
	private long available;
	private long na;
	private BigDecimal required;
	private long score;
	private BigDecimal rating;
}
