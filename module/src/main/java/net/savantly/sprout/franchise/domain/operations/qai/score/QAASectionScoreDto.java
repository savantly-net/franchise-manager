package net.savantly.sprout.franchise.domain.operations.qai.score;

import java.util.ArrayList;
import java.util.List;

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
}
