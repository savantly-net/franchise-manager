package net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answer;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Table(name = "fm_qai_guest_question_answer")
@Getter @Setter
@Accessors(chain = true)
public class QAIGuestQuestionAnswer extends TenantKeyedEntity {

	private String guestQuestionId;
	@Enumerated(EnumType.STRING)
	private QAIGuestQuestionAnswerType value;
}
