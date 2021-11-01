package net.savantly.sprout.franchise.domain.posownership;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.rest.crud.TenantedDtoController;

@RestController
@RequestMapping("/api/fm/pos_owners")
public class PosOwnershipApi extends TenantedDtoController<PosOwnership, PosOwnership> {

	public PosOwnershipApi(TenantKeyedRepository<PosOwnership> repository) {
		super(repository);
	}

	@Override
	protected PosOwnership createEntity(PosOwnership object) {
		return object;
	}

	@Override
	protected PosOwnership updateEntity(PosOwnership entity, PosOwnership object) {
		return object;
	}

	@Override
	protected PosOwnership convert(PosOwnership entity) {
		return entity;
	}

	
}
