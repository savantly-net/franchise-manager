package net.savantly.sprout.franchise.domain.operations.qai.guestQuestion;

import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Getter
@Setter
public class QAIGuestQuestionDto {

	private String itemId;
	private String sectionId;
	private int order;

	@Size(max = 500)
	private String text;
	
	private int points = 1;
	private boolean deleted;
}
