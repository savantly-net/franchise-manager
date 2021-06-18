package net.savantly.sprout.franchise.domain.group;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.rest.crud.TenantedDtoController;


@RestController
@RequestMapping("/api/fm/groups")
public class FranchiseGroupsApi extends TenantedDtoController<FranchiseGroup, FranchiseGroup> {

	public FranchiseGroupsApi(FranchiseGroupRepository repository) {
		super(repository);
	}

	/**
	 * No-op since we're exposing the entity directly 
	 */
	@Override
	protected FranchiseGroup convert(FranchiseGroup object) {
		return object;
	}

	@Override
	protected FranchiseGroup createEntity(FranchiseGroup object) {
		return object;
	}

	@Override
	protected FranchiseGroup updateEntity(FranchiseGroup entity, FranchiseGroup object) {
		return object;
	}

}
