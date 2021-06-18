package net.savantly.sprout.franchise.domain.ownership;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.rest.crud.TenantedDtoController;

@RestController
@RequestMapping("/api/fm/owners")
public class FranchiseOwnershipApi extends TenantedDtoController<FranchiseOwnership, FranchiseOwnership> {

	public FranchiseOwnershipApi(TenantKeyedRepository<FranchiseOwnership> repository) {
		super(repository);
	}

	@Override
	protected FranchiseOwnership convert(FranchiseOwnership object) {
		return object;
	}

	@Override
	protected FranchiseOwnership createEntity(FranchiseOwnership object) {
		return object;
	}

	@Override
	protected FranchiseOwnership updateEntity(FranchiseOwnership entity, FranchiseOwnership object) {
		return object;
	}

}
