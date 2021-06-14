package net.savantly.sprout.franchise.domain.report;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;

@Configuration
public class ReportSourceConfiguration {

	@Bean
	public ReportSourceApi reportSourceApi(TenantKeyedRepository<ReportSource> repo) {
		return new ReportSourceApi(repo);
	}
	
	@Bean
	public ReportSourceMenuContributor reportSourceMenuContributor(ReportSourceRepository repository) {
		return new ReportSourceMenuContributor(repository);
	}
}
