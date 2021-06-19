package net.savantly.franchise;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Import;

import net.savantly.sprout.starter.migration.CoreDBMigrationConfiguration;

@SpringBootTest
public class SproutApplicationTest {

	@Test
	public void test() {
		// assert application starts
	}
	
	@TestConfiguration
	@Import(CoreDBMigrationConfiguration.class)
	static class TestConfig {
		
	}
}
