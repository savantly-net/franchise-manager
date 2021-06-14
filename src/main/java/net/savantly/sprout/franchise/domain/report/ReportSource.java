package net.savantly.sprout.franchise.domain.report;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Table(name = "fm_report_source")
@Accessors(chain = true)
public class ReportSource extends TenantKeyedEntity {
	
	@Enumerated(EnumType.STRING)
	private ReportSourceType sourceType = ReportSourceType.VIEW;
	private String name;
	private String url;
	private String menuPath;
	private String icon;
	private Long weight;

	@Size(max = 64000)
	@Column(length = 64000)
	private String template;
	
	@Enumerated(EnumType.STRING)
	private ReportSourceTemplateType templateType;

}
