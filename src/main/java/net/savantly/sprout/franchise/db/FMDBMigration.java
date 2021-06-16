package net.savantly.sprout.franchise.db;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Configuration;

import lombok.AllArgsConstructor;

@Configuration
@AllArgsConstructor
public class FMDBMigration {
	
	private static final String SCHEMA_VERSION_TABLE = "fm_schema_version";
	private final DataSource dataSource;

	@PostConstruct
    public void migrate() {
		DataSource source = (DataSource) dataSource;
        Flyway flyway = Flyway.configure()
        		.dataSource(source)
        		.locations(String.format("classpath:/fm/db/%s", getDbType(dataSource)))
        		// don't clean the db out!!!
        		.cleanDisabled(true)
        		.table(SCHEMA_VERSION_TABLE)
        		.baselineOnMigrate(true)
        		.baselineVersion("0")
        		.load();
        flyway.migrate();
    }

	//TODO: detect correct db type
	private String getDbType(DataSource dataSource2) {
		return "postgres";
	}

}
