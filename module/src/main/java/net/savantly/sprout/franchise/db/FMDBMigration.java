package net.savantly.sprout.franchise.db;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FMDBMigration {
	
	private static final String SCHEMA_VERSION_TABLE = "fm_schema_version";
	private final DataSource dataSource;
	private final Logger log = LoggerFactory.getLogger(FMDBMigration.class);
	Flyway flyway;

	private boolean autoMigrate = false;

	public FMDBMigration(DataSource ds) {
		this.dataSource = ds;
	}

	public FMDBMigration(DataSource ds, boolean auto) {
		this.autoMigrate = false;
		this.dataSource = ds;
	}

	public void setAutoMigrate(boolean auto) {
		this.autoMigrate = auto;
	}

	@PostConstruct
	public void postConstruct() {
		configure();
		if (this.autoMigrate) {
			migrate();
		}
	}

	public void configure() {
		DataSource source = (DataSource) dataSource;
		flyway = Flyway.configure()
		.dataSource(source)
		.locations(String.format("classpath:/fm/db/%s", getDbType(dataSource)))
		// don't clean the db out!!!
		.cleanDisabled(true)
		.table(SCHEMA_VERSION_TABLE)
		.baselineOnMigrate(true)
		.baselineVersion("0")
		.load();
	}

    public void migrate() {
        try {
            flyway.migrate();
        } catch (Exception e) {
        	log.error("failed to migrate frachise manager", e);
        }
    }

	public MigrationInfoService getMigrationInfo() {
		return flyway.info();
	}

	//TODO: detect correct db type
	private String getDbType(DataSource dataSource2) {
		return "postgres";
	}

}
