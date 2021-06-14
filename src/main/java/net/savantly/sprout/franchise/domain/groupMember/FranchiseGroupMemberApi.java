package net.savantly.sprout.franchise.domain.groupMember;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.rest.crud.TenantedDtoController;

@RestController
@RequestMapping("/api/fm/group-members")
public class FranchiseGroupMemberApi extends TenantedDtoController<FranchiseGroupMember, FranchiseGroupMember>{

	public FranchiseGroupMemberApi(TenantKeyedRepository<FranchiseGroupMember> repository) {
		super(repository);
	}

	@Override
	protected FranchiseGroupMember createEntity(FranchiseGroupMember object) {
		return object;
	}

	@Override
	protected FranchiseGroupMember updateEntity(FranchiseGroupMember entity, FranchiseGroupMember object) {
		return object;
	}

	@Override
	protected FranchiseGroupMember convert(FranchiseGroupMember entity) {
		return entity;
	}

}
