package net.savantly.sprout.franchise.domain.operations.qai.audit;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.domain.AbstractAuditableDomainObject;

@Entity
@Accessors(chain = true)
@Getter
@Setter
@Table(name = "fm_qaa_submission")
public class QAASubmission extends AbstractAuditableDomainObject<String> {
	@Id
	private String id;
	@Column(name = "location_id")
	private String locationId;
	@Column(name = "date_scored")
	private LocalDateTime dateScored;
	@Column(name = "manager_on_duty")
	private String managerOnDuty;
	
	private String fsc;
	private String fsm;
	
	@Column(name = "responsible_alcohol_cert")
	private String responsibleAlcoholCert;
	
	@Column(name = "time_start", columnDefinition = "TIME")
	private LocalTime timeStart;

	@Column(name = "time_end", columnDefinition = "TIME")
	private LocalTime timeEnd;
	
	@ElementCollection
	@CollectionTable(name = "fm_qaa_submission_sections", joinColumns = { @JoinColumn(name = "qaa_submission_id")})
	@Column(name="section_id")
	Set<String> sectionSubmissionIds = new HashSet<>();
}
