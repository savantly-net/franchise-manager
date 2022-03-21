package net.savantly.sprout.franchise.domain.operations.qai.question;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Max;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategory;

@Entity
@Accessors(chain = true)
@Getter @Setter
@Table(name = "fm_qai_question")
public class QAIQuestion extends TenantKeyedEntity {
	
	private String sectionId;
	
	@ManyToOne(optional = false, fetch = FetchType.EAGER)
	private QAIQuestionCategory category;
	private String tags;

	@Column(name = "item_order")
	private int order;
	
	@Max(1000)
	@Column(length = 1000)
	private String text;
	
	private int points;
	
	/*
	 * Soft delete
	 */
	private boolean deleted;

}
