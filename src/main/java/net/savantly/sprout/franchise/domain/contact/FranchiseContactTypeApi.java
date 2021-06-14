package net.savantly.sprout.franchise.domain.contact;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.rest.crud.TenantedDtoController;

@RestController
@RequestMapping("/api/fm/contact-types")
public class FranchiseContactTypeApi extends TenantedDtoController<FranchiseContactType, FranchiseContactType> {

	public FranchiseContactTypeApi(TenantKeyedRepository<FranchiseContactType> repository) {
		super(repository);
	}

	@Override
	protected FranchiseContactType convert(FranchiseContactType object) {
		return object;
	}

	@Override
	protected FranchiseContactType createEntity(FranchiseContactType object) {
		return object;
	}

	@Override
	protected FranchiseContactType updateEntity(FranchiseContactType entity, FranchiseContactType object) {
		return object;
	}

}
