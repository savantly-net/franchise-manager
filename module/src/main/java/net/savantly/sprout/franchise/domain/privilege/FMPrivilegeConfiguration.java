package net.savantly.sprout.franchise.domain.privilege;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import net.savantly.sprout.core.domain.privilege.PrivilegeRepository;
import net.savantly.sprout.core.domain.tenant.TenantRepository;

@Configuration
@DependsOn("CoreDBMigrator")
public class FMPrivilegeConfiguration {
	
	@Bean
	public FMPrivilegeContributor fmPrivilegeContributor(PrivilegeRepository privRepo, TenantRepository tenantRepo) {
		return new FMPrivilegeContributor(privRepo, tenantRepo);
	}

}
