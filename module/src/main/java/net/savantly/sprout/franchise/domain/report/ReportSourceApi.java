package net.savantly.sprout.franchise.domain.report;

import java.util.Optional;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.core.domain.user.SproutUser;
import net.savantly.sprout.core.security.SproutSecurityContext;
import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.franchise.domain.privilege.FMPrivilege;
import net.savantly.sprout.rest.crud.TenantedDtoController;


@RestController
@RequestMapping("/api/fm/report-source")
public class ReportSourceApi extends TenantedDtoController<ReportSource, ReportSource> {

	public ReportSourceApi(TenantKeyedRepository<ReportSource> repository) {
		super(repository);
	}

	@Override
	protected ReportSource createEntity(ReportSource object) {
		return object;
	}

	@Override
	protected ReportSource updateEntity(ReportSource entity, ReportSource object) {
		return object;
	}

	@Override
	protected ReportSource convert(ReportSource entity) {
		return entity;
	}
	
	@Override
	protected boolean canDeleteById(String itemId) {
		Optional<SproutUser> optUser = SproutSecurityContext.getCurrentUser();
		if (optUser.isPresent() && 
				(optUser.get().hasAuthority(FMPrivilege.FM_ADMIN) || optUser.get().hasAuthority("ADMIN"))) {
			return true;
		} else {
			return false;
		}
	}

}
