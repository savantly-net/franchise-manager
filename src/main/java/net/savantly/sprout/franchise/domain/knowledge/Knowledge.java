package net.savantly.sprout.franchise.domain.knowledge;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Table(name = "fm_knowledge")
public class Knowledge extends TenantKeyedEntity {

	@Size(max = 255)
	@Column(length = 255)
	private String title;
	
	@Size(max = 15000)
	@Column(length = 15000)
	private String text;

	@ElementCollection
	private List<String> tags = new ArrayList<>();
}
