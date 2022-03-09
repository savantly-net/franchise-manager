package net.savantly.sprout.franchise.domain.operations.qai.audit;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISectionSubmissionDto;

@Getter
@Setter
@Accessors(chain = true)
public class QAADto {
	private String id;
	private String locationId;
	private LocalDateTime dateScored;
	private String managerOnDuty;
	private String fsc;
	private String responsibleAlcoholCert;

	Set<QAISectionSubmissionDto> sections = new HashSet<QAISectionSubmissionDto>();
}
