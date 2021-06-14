package net.savantly.sprout.franchise.domain.operations.qai.question.answer;

import java.util.HashSet;
import java.util.Set;

import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.franchise.domain.files.FileItem;

@Getter @Setter
@Accessors(chain = true)
public class QAIQuestionAnswerDto {

	private String itemId;
	private String questionId;
	private QAIQuestionAnswerType value;
	
	@Size(max = 1500)
	private String notes;

	private Set<FileItem> attachments = new HashSet<>();
}
