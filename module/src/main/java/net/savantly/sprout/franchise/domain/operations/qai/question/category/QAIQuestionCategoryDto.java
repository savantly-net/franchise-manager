package net.savantly.sprout.franchise.domain.operations.qai.question.category;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Getter
@Setter
public class QAIQuestionCategoryDto {
	private String itemId;
	private int order;
	private String name;

}
