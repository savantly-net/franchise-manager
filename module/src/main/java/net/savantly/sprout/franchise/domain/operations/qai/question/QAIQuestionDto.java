package net.savantly.sprout.franchise.domain.operations.qai.question;

import javax.validation.constraints.Max;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Getter
@Setter
public class QAIQuestionDto {
	private String itemId;
	private String sectionId;
	private String categoryId;

	private int order;
	@Max(1000)
	private String text;

	private int points;
	private boolean deleted;
}
