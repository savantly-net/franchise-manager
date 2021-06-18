package net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answerGroup;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.franchise.domain.files.FileItem;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answer.QAIGuestQuestionAnswerDto;

@Getter @Setter
@Accessors(chain = true)
public class QAIGuestQuestionAnswerGroupDto {

	private String itemId;
	private List<QAIGuestQuestionAnswerDto> answers = new ArrayList<>();
	@Size(max = 2000)
	private String notes;
	private Set<FileItem> attachments = new HashSet<>();
}
