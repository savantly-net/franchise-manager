package net.savantly.sprout.franchise.domain.market;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.rest.crud.TenantedDtoController;

@RestController
@RequestMapping("/api/fm/markets")
public class FranchiseMarketsApi extends TenantedDtoController<FranchiseMarket, FranchiseMarket> {

	public FranchiseMarketsApi(FranchiseMarketRepository repository) {
		super(repository);
	}

	@Override
	protected FranchiseMarket convert(FranchiseMarket object) {
		// not using a DTO at this time, so just pass the entity back
		return object;
	}

	@Override
	protected FranchiseMarket createEntity(FranchiseMarket object) {
		return object;
	}

	@Override
	protected FranchiseMarket updateEntity(FranchiseMarket entity, FranchiseMarket object) {
		return object;
	}

}
