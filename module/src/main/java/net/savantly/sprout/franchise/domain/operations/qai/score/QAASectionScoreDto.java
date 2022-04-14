package net.savantly.sprout.franchise.domain.operations.qai.score;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter @Setter
@Accessors(chain = true)
public class QAASectionScoreDto {
	private String sectionId;
	private String sectionName;
	private long order;
	
//	private long available;
//	private long na;
//	private BigDecimal required;
//	private long score;
//	private BigDecimal rating;
	
	private List<QAASectionCategoryScoreDto> categoryScores = new ArrayList<>();
	
	public BigDecimal getRating() {
		if (Objects.isNull(categoryScores)) {
			return BigDecimal.ZERO;
		}
		long available = 0;
		long score = 0;
		for (QAASectionCategoryScoreDto qaaSectionCategoryScoreDto : categoryScores) {
			available += qaaSectionCategoryScoreDto.getAvailable();
			score = qaaSectionCategoryScoreDto.getScore();
		}
		if (available == 0 || score == 0) {
			return BigDecimal.ZERO;
		} else {
			return new BigDecimal(score).setScale(2).divide(new BigDecimal(available), RoundingMode.HALF_UP).setScale(2);
		}
	}
}
