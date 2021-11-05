package net.savantly.sprout.franchise.domain.storepos;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.rest.crud.TenantedDtoController;

@RestController
@RequestMapping("/api/fm/store_pos")
public class StorePosApi extends TenantedDtoController<StorePos, StorePos> {

	public StorePosApi(TenantKeyedRepository<StorePos> repository) {
		super(repository);
	}

	@Override
	protected StorePos createEntity(StorePos object) {
		return object;
	}

	@Override
	protected StorePos updateEntity(StorePos entity, StorePos object) {
		return object;
	}

	@Override
	protected StorePos convert(StorePos entity) {
		return entity;
	}

	
}
