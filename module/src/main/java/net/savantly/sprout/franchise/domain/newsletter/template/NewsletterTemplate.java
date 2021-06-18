package net.savantly.sprout.franchise.domain.newsletter.template;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Table(name = "fm_newsletter_template")
public class NewsletterTemplate extends TenantKeyedEntity {

	@Size(max = 255)
	@Column(length = 255)
	private String title;
	
	@Size(max = 15000)
	@Column(length = 15000)
	private String text;
}
