package net.savantly.sprout.franchise.domain.operations.visit;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.module.forms.FormService;
import net.savantly.sprout.module.forms.domain.data.FormDataDto;

@RequiredArgsConstructor
public class StoreVisitService {

	private final StoreVisitRepository repo;
	private final FormService formService;

	public StoreVisit createEntity(StoreVisitDto object) {
		
		String formDataId = null;
		FormDataDto saved = createFormData(object.getFormData());
		formDataId = saved.getId();
		
		StoreVisit entity = new StoreVisit()
				.setFormDataId(formDataId)
				.setLocationId(object.getLocationId())
				.setSectionSubmissionId(object.getSectionSubmissionId());
		return entity;
	}

	private FormDataDto createFormData(FormDataDto formData) {
		return formService.createFormData(formData);
	}

	private FormDataDto updateFormData(FormDataDto formData) {
		return formService.updateFormData(formData);
	}

	public StoreVisit updateEntity(StoreVisitDto object) {

		String formDataId = object.getFormDataId();
		if (Objects.nonNull(formDataId)) {
			formDataId = updateFormData(object.getFormData()).getId();
		} else {
			FormDataDto saved = createFormData(object.getFormData());
			formDataId = saved.getId();
		}
		
		StoreVisit entity = repo.findByIdItemId(object.getItemId())
				.orElseThrow(() -> new EntityNotFoundException("store visit not found" + object.getItemId()));
		entity.setFormDataId(formDataId)
			.setLocationId(object.getLocationId())
			.setSectionSubmissionId(object.getSectionSubmissionId());
		return entity;
	}

	public StoreVisitDto convert(StoreVisit entity) {
		return new StoreVisitDto()
				.setFormDataId(entity.getFormDataId())
				.setFormData(getFormDataById(entity.getFormDataId()))
				.setItemId(entity.getItemId())
				.setLocationId(entity.getLocationId())
				.setSectionSubmissionId(entity.getSectionSubmissionId())
				.setCreatedDate(entity.getCreatedDate().orElse(null));
	}
	
	public List<StoreVisitDto> findByLocationId(String locationId) {
		return this.repo.findByLocationId(locationId).stream().map(v -> convert(v)).collect(Collectors.toList());
	}

	private FormDataDto getFormDataById(String formDataId) {
		if (Objects.nonNull(formDataId)) {
			return formService.getFormDataById(formDataId);
		} else {
			return null;
		}
	}

}
