package net.savantly.sprout.franchise.domain.operations.qai.guestQuestion;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Table(name = "fm_qai_guest_question")
@Getter @Setter
@Accessors(chain = true)
public class QAIGuestQuestion extends TenantKeyedEntity {

	private String sectionId;
	@Column(name = "item_order")
	private int order;

	@Size(max = 500)
	@Column(length = 500)
	private String text;
	
	private int points = 1;
	private boolean deleted;

}
