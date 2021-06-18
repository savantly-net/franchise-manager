package net.savantly.sprout.franchise.domain.operations.qai.section;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.QAIGuestQuestionDto;
import net.savantly.sprout.franchise.domain.operations.qai.question.QAIQuestionDto;

@Accessors(chain = true)
@Getter
@Setter
public class QAISectionDto {

	private String itemId;
	private String name;
	private int order;
	private List<QAIQuestionDto> questions = new ArrayList<>();
	private List<QAIGuestQuestionDto> guestQuestions = new ArrayList<>();

	private boolean requireStaffAttendance;
}
