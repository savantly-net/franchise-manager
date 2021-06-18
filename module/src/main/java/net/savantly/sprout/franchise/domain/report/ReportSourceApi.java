package net.savantly.sprout.franchise.domain.report;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
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

}
