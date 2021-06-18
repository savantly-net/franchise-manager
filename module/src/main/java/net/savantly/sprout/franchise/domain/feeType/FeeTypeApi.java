package net.savantly.sprout.franchise.domain.feeType;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.rest.crud.TenantedDtoController;

@RestController
@RequestMapping("/api/fm/fee-types")
public class FeeTypeApi extends TenantedDtoController<FranchiseFeeType, FranchiseFeeType> {

	public FeeTypeApi(TenantKeyedRepository<FranchiseFeeType> repository) {
		super(repository);
	}

	@Override
	protected FranchiseFeeType convert(FranchiseFeeType object) {
		return object;
	}

	@Override
	protected FranchiseFeeType createEntity(FranchiseFeeType object) {
		return object;
	}

	@Override
	protected FranchiseFeeType updateEntity(FranchiseFeeType entity, FranchiseFeeType object) {
		return object;
	}

}
