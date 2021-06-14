package net.savantly.sprout.franchise.domain.kpi;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KpiConfiguration {

	/**
	 * Default implementation returns empty kpis.  
	 * @return
	 */
	@Bean
	@ConditionalOnMissingBean
	public KpiProvider defaultKpiProvider() {
		return new KpiProvider() {
			
			@Override
			public Map<String, Object> getKpis(String locationId) {
				return new HashMap<>();
			}
			
			@Override
			public Map<String, Object> getKpis() {
				return new HashMap<>();
			}
		};
	}
	
	@Bean
	@ConditionalOnMissingBean
	public KpiApi defaultKpiApi(KpiProvider provider) {
		return new KpiApi(provider);
	}
}
