package net.savantly.sprout.franchise.domain.operations.visit;

import java.time.ZonedDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.module.forms.domain.data.FormDataDto;

@Accessors(chain = true)
@Getter
@Setter
public class StoreVisitDto {
	private String itemId;
	private String locationId;
	private String formDataId;
	private String sectionSubmissionId;
	
	private FormDataDto formData;
	private ZonedDateTime createdDate;
}
