package net.savantly.sprout.franchise.domain.operations.qai.audit;

import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
public class QAASummaryDto {
	private String id;
	private String locationId;
	private LocalDateTime dateScored;
	private String managerOnDuty;
	private String fsc;
	private String fsm;
	private String responsibleAlcoholCert;
	private LocalTime startTime;
	private LocalTime endTime;
}
