package net.savantly.sprout.franchise.db;

import javax.sql.DataSource;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.postgresql.ds.PGSimpleDataSource;
import org.postgresql.jdbc3.Jdbc3SimpleDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

import test.AbstractContainerBaseTest;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
public class FMDBMigration_test extends AbstractContainerBaseTest {

    @Autowired
    FMDBMigration mig;

    /**
     * This needs to be update for any new migrations
     */
    final String expectedVersion = "0.0.7";

    @Test
    public void testMigration() {
        mig.migrate();
        Assertions.assertEquals(expectedVersion, mig.getMigrationInfo().current().getVersion().getVersion());
    }
    
    
    @TestConfiguration
    static class testConfig {

        @Bean
        public FMDBMigration migration(DataSource dataSource) {
            FMDBMigration mig = new FMDBMigration(dataSource);
            mig.setAutoMigrate(false);
            return mig;
        }

        @Bean
        public DataSource datasource(Environment env) {
            PGSimpleDataSource ds = new PGSimpleDataSource();
            ds.setUser(env.getProperty("spring.datasource.username"));
            ds.setPassword(env.getProperty("spring.datasource.password"));
            ds.setURL(env.getProperty("spring.datasource.url"));
            return ds;
        }
        
    }
}

