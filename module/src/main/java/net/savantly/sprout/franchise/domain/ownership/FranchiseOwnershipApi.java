package net.savantly.sprout.franchise.domain.ownership;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.rest.crud.TenantedDtoController;

@RestController
@RequestMapping("/api/fm/owners")
public class FranchiseOwnershipApi extends TenantedDtoController<FranchiseOwnership, FranchiseOwnership> {
	
	private final FranchiseOwnershipRepository repo;

	public FranchiseOwnershipApi(FranchiseOwnershipRepository repository) {
		super(repository);
		this.repo = repository;
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
	
	@GetMapping("/group/{groupId}")
	public List<FranchiseOwnership> findByGroupId(String groupId) {
		return this.repo.findByGroupId(groupId);
	}

	@GetMapping("/location/{locationId}")
	public List<FranchiseOwnership> findByLocationId(String locationId) {
		return this.repo.findByLocationId(locationId);
	}
}
