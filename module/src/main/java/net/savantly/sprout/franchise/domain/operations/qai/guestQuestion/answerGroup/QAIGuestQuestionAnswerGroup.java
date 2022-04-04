package net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answerGroup;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;
import net.savantly.sprout.franchise.domain.files.FileItem;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answer.QAIGuestQuestionAnswer;

@Entity
@Table(name = "fm_qai_guest_question_answer_group")
@Getter @Setter
public class QAIGuestQuestionAnswerGroup extends TenantKeyedEntity {

	@OneToMany(cascade = CascadeType.ALL)
	private List<QAIGuestQuestionAnswer> answers = new ArrayList<>();
	@Column(length = 2000)
	@Size(max = 2000)
	private String notes;
	
	@Embedded
	@ElementCollection
	private Set<FileItem> attachments = new HashSet<>();
}
