package net.savantly.sprout.franchise.domain.operations.qai.audit;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CollectionTable;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Entity
@Accessors(chain = true)
@Getter
@Setter
@Table(name = "fm_qaa_submission")
public class QAASubmission {
	@Id
	private String id;
	private String locationId;
	private LocalDateTime dateScored;
	private String managerOnDuty;
	private String fsc;
	private String responsibleAlcoholCert;
	
	@ElementCollection
	@CollectionTable(name = "fm_qaa_submission_sections", joinColumns = { @JoinColumn(name = "qaa_submission_id")})
	Set<String> sectionIds = new HashSet<>();
}
