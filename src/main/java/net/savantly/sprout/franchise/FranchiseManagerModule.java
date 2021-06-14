package net.savantly.sprout.franchise;

import javax.sql.DataSource;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import net.savantly.sprout.core.module.SproutModuleConfiguration;
import net.savantly.sprout.core.module.SproutWebModule;
import net.savantly.sprout.franchise.domain.DomainServiceConfiguration;
import net.savantly.sprout.franchise.domain.kpi.KpiConfiguration;
import net.savantly.sprout.franchise.domain.operations.qai.QAIConfiguration;
import net.savantly.sprout.franchise.domain.operations.visits.StoreVisitConfiguration;

@EntityScan
@Configuration(FranchiseManagerModule.KEY)
@EnableJpaRepositories
@SproutModuleConfiguration
@Import({DomainServiceConfiguration.class, QAIConfiguration.class, StoreVisitConfiguration.class, KpiConfiguration.class})
public class FranchiseManagerModule implements SproutWebModule {

	public static final String KEY = "franchise-manager";
	private static final String NAME = "Franchise Manager";
	private static final String VERSION = "2.0.0";
	private final DataSource dataSource;
	
	public FranchiseManagerModule(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	@Override
	public String getId() {
		return KEY;
	}

	@Override
	public String getName() {
		return NAME;
	}

	@Override
	public String getVersion() {
		return VERSION;
	}

	@Override
	public String getDescription() {
		return "A franchise manager module and ui-plugin for Sprout";
	}

}
