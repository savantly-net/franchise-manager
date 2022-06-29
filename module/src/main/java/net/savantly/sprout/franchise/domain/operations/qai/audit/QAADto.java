package net.savantly.sprout.franchise.domain.operations.qai.audit;

import java.time.LocalDate;
import java.time.LocalTime;
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
	private LocalDate dateScored;
	private String managerOnDuty;
	private String fsc;
	private String fsm;
	private String responsibleAlcoholCert;
	private LocalTime startTime;
	private LocalTime endTime;

	private Set<QAISectionSubmissionDto> sections = new HashSet<QAISectionSubmissionDto>();
}
