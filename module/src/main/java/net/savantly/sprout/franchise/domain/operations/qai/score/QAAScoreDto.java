package net.savantly.sprout.franchise.domain.operations.qai.score;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter @Setter
@Accessors(chain = true)
public class QAAScoreDto {

	private String submissionId;
	private long overallAvailable;
	private long overallNA;
	private BigDecimal overallRequired;
	private long overallScore;
	private BigDecimal overallRating;

	private List<QAASectionScoreDto> sections = new ArrayList<QAASectionScoreDto>();
	private List<QAAScoreByTagDto> scoresByTag = new ArrayList<>(); 
	
}
