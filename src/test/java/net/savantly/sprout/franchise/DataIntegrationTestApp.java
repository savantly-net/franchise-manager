package net.savantly.sprout.franchise;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import net.savantly.sprout.core.tenancy.TenantedRepositoryAspect;

@SpringBootApplication
@EnableAspectJAutoProxy
@SuppressWarnings("deprecation")
@EnableJpaRepositories(basePackages = {"net.savantly.sprout"})
@EntityScan(basePackages = {"net.savantly.sprout"})
@ActiveProfiles({"test"})
public class DataIntegrationTestApp {
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return NoOpPasswordEncoder.getInstance();
	}
	
	@Bean
	public TenantedRepositoryAspect tenantedRepositoryAspect() {
		return new TenantedRepositoryAspect();
	}

}
