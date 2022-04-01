package net.savantly.sprout.franchise.domain.operations.qai.section.submission;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answerGroup.QAIGuestQuestionAnswerGroupDto;
import net.savantly.sprout.franchise.domain.operations.qai.question.answer.QAIQuestionAnswerDto;

@Getter
@Setter
@Accessors(chain = true)
public class QAISectionSubmissionDto {

	private String itemId;
	private String sectionId;
	private String locationId;
	private String managerOnDuty;
	private ZonedDateTime dateScored;
	private QAISubmissionState status;
	private List<QAIQuestionAnswerDto> answers = new ArrayList<>();
	private List<QAIGuestQuestionAnswerGroupDto> guestAnswers = new ArrayList<>();
	Map<String, String> staffAttendance = new HashMap<String, String>(); // maps from attribute name to value
	private int order;
}
