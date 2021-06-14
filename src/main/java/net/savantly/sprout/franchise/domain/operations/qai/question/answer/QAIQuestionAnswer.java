package net.savantly.sprout.franchise.domain.operations.qai.question.answer;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;
import net.savantly.sprout.franchise.domain.files.FileItem;

@Entity
@Getter @Setter
@Accessors(chain = true)
@Table(name = "fm_qai_question_answer")
public class QAIQuestionAnswer extends TenantKeyedEntity {

	private String questionId;
	
	@Enumerated(EnumType.STRING)
	private QAIQuestionAnswerType value;
	
	@Size(max = 1500)
	@Column(length = 1500)
	private String notes;

	@Embedded
	@ElementCollection
	private Set<FileItem> attachments = new HashSet<>();
	
}
