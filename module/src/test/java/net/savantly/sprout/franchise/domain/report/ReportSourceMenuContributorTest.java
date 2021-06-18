package net.savantly.sprout.franchise.domain.report;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Objects;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.wait.strategy.HostPortWaitStrategy;

import example.TestApplication;
import net.savantly.sprout.domain.menu.MenuDto;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, classes = TestApplication.class)
public class ReportSourceMenuContributorTest  {
	
	@Autowired
	ReportSourceRepository repo;
	@Autowired
	ReportSourceMenuContributor menuContributor;

	protected static String dbName = "ReportSourceMenuContributorTest";
	protected static String username = "it_user";
	protected static String password = "it_pass";

	static final PostgreSQLContainer DB_CONTAINER = (PostgreSQLContainer) new PostgreSQLContainer()
			.withDatabaseName(dbName)
			.withUsername(username)
			.withPassword(password)
			.withReuse(true)
			.waitingFor(new HostPortWaitStrategy());;

	static {
		DB_CONTAINER.start();
	}

	@DynamicPropertySource
	static void properties(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", DB_CONTAINER::getJdbcUrl);
		registry.add("spring.datasource.username", () -> username);
		registry.add("spring.datasource.password", () -> password);
		registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
	}
	
	@Test
	public void test() {
		ReportSource r1 = getReportSource("", "one", "url");
		ReportSource r2 = getReportSource("sub", "two", "url");
		ReportSource r3 = getReportSource("sub", "three", "url");
		ReportSource r4 = getReportSource("sub|sub", "four", "url");
		ReportSource r5 = getReportSource("sub|sub", "five", "url");
		repo.saveAll(Arrays.asList(r1, r2, r3, r4, r5));
		
		ArrayList<MenuDto> menus = new ArrayList<MenuDto>();
		menuContributor.contribute(menus);
		
		Assertions.assertEquals(1, menus.size(), "the root menu should be present");
		Assertions.assertTrue(Objects.nonNull(menus.get(0)), "the reports menu should not be null");
		Assertions.assertEquals(2, menus.get(0).getChildren().size(), "there should be 2. report item and sub");
		Assertions.assertTrue(menus.get(0).getChildren().stream()
				.filter(m -> m.getName().contentEquals("sub")).findFirst().isPresent(), "there should be a submenu with name sub");
	}

	private ReportSource getReportSource(String path, String name, String url) {
		return new ReportSource().setMenuPath(path).setName(name).setUrl(url);
	}

}
