package net.savantly.sprout.franchise.domain.operations.visit;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.rest.crud.TenantedDtoController;

@RestController
@RequestMapping("/api/fm/store-visit")
public class StoreVisitApi extends TenantedDtoController<StoreVisit, StoreVisitDto> {
	
	private final StoreVisitService service;
	private final StoreVisitDynamicFieldsProvider fieldProvider;

	public StoreVisitApi(TenantKeyedRepository<StoreVisit> repository, StoreVisitService service, StoreVisitDynamicFieldsProvider fieldProvider) {
		super(repository);
		this.service = service;
		this.fieldProvider = fieldProvider;
	}
	
	@GetMapping("/dynamic-fields/{locationId}")
	public Map<String, Object> getDynamicFields(@PathVariable("locationId") String locationId) {
		return fieldProvider.getDynamicFields(locationId);
	}

	@Override
	protected StoreVisit createEntity(StoreVisitDto object) {
		return service.createEntity(object);
	}

	@Override
	protected StoreVisit updateEntity(StoreVisit entity, StoreVisitDto object) {
		return service.updateEntity(object);
	}

	@Override
	protected StoreVisitDto convert(StoreVisit entity) {
		return service.convert(entity);
	}

}
