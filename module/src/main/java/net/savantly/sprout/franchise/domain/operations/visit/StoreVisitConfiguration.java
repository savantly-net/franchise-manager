package net.savantly.sprout.franchise.domain.operations.visit;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.module.forms.FormService;

@Configuration
public class StoreVisitConfiguration {
	
	@Bean
	@ConditionalOnMissingBean
	public StoreVisitDynamicFieldsProvider defaultStoreVisitDynamicFieldsProvider() {
		return new StoreVisitDynamicFieldsProvider() {
			
			@Override
			public Map<String, Object> getDynamicFields(String locationId) {
				return new HashMap<>();
			}
		};
	}
	
	@Bean
	public StoreVisitService fmStoreVisitService(StoreVisitRepository repo, FormService formService) {
		return new StoreVisitService(repo, formService);
	}
	
	@Bean
	public StoreVisitApi fmStoreVisitApi(TenantKeyedRepository<StoreVisit> repository, StoreVisitService service, StoreVisitDynamicFieldsProvider dynamicFieldsProvider) {
		return new StoreVisitApi(repository, service, dynamicFieldsProvider);
	}

}
