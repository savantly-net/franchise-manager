package net.savantly.sprout.franchise.domain.operations.qai.question.category;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter
@Setter
@Accessors(chain = true)
@Table(name = "fm_qai_question_category", uniqueConstraints = {
		@UniqueConstraint(columnNames = { "name", "tenant_id" }) })
public class QAIQuestionCategory extends TenantKeyedEntity {

	@Column(name = "item_order")
	private int order;
	private String name;

}
