package net.savantly.sprout.franchise.domain.newsletter;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.rest.crud.TenantedDtoController;

@RequestMapping("/api/fm/newsletter")
@RestController
public class NewsletterApi extends TenantedDtoController<Newsletter, Newsletter> {

	public NewsletterApi(TenantKeyedRepository<Newsletter> repository) {
		super(repository);
	}

	@Override
	protected Newsletter convert(Newsletter object) {
		return object;
	}

	@Override
	protected Newsletter createEntity(Newsletter object) {
		return object;
	}

	@Override
	protected Newsletter updateEntity(Newsletter entity, Newsletter object) {
		return object;
	}

}
