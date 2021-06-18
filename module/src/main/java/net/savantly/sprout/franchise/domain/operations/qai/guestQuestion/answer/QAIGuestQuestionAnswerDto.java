package net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answer;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter @Setter
@Accessors(chain = true)
public class QAIGuestQuestionAnswerDto {

	private String itemId;
	private String guestQuestionId;
	private QAIGuestQuestionAnswerType value;
}
