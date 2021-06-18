package net.savantly.sprout.franchise.domain.qai.section;

import java.net.URI;
import java.util.ArrayList;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.wait.strategy.HostPortWaitStrategy;

import com.fasterxml.jackson.databind.ObjectMapper;

import example.TestApplication;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.QAIGuestQuestionDto;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.QAIGuestQuestionRepository;
import net.savantly.sprout.franchise.domain.operations.qai.question.QAIQuestionDto;
import net.savantly.sprout.franchise.domain.operations.qai.question.QAIQuestionRepository;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategory;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategoryRepository;
import net.savantly.sprout.franchise.domain.operations.qai.section.QAISectionDto;
import test.AbstractContainerBaseTest;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, classes = TestApplication.class)
public class QAISectionApiTest extends AbstractContainerBaseTest {

	@Autowired
	TestRestTemplate rest;
	@Autowired
	ObjectMapper mapper;
	@Autowired
	QAIQuestionCategoryRepository categoryRepo;
	@Autowired
	QAIQuestionRepository qrepo;
	@Autowired
	QAIGuestQuestionRepository gqrepo;
	
	
	private String user = "admin";
	private String password = "changeme!";
	
	protected static String dbName = "QAISectionApiTest";
	protected static String dbUsername = "it_user";
	protected static String dbPassword = "it_pass";

	static final PostgreSQLContainer DB_CONTAINER = (PostgreSQLContainer) new PostgreSQLContainer()
			.withDatabaseName(dbName)
			.withUsername(dbUsername)
			.withPassword(dbPassword)
			.withReuse(true)
			.waitingFor(new HostPortWaitStrategy());;

	static {
		DB_CONTAINER.start();
	}
	
	@AfterAll
	static void afterAll() {
		
	}
	
	@BeforeEach
	public void beforeEach() {
		this.gqrepo.deleteAll();
		this.qrepo.deleteAll();
		this.categoryRepo.deleteAll();
	}

	@DynamicPropertySource
	static void properties(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", DB_CONTAINER::getJdbcUrl);
		registry.add("spring.datasource.username", () -> dbUsername);
		registry.add("spring.datasource.password", () -> dbPassword);
		registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
	}
	

	@Test
	public void getAll() throws Exception {
		String url = "/api/fm/qai/section";
		RequestEntity request = RequestEntity.get(new URI(url)).accept(MediaType.APPLICATION_JSON).build();
		ResponseEntity<Object> response = rest.withBasicAuth(user, password).exchange(request, Object.class);
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode(), "Should return a list");
	}

	@Test
	public void createOne() throws Exception {

		QAIQuestionCategory category = categoryRepo.save(new QAIQuestionCategory().setName("test"));

		String test = "test";
		String url = "/api/fm/qai/section";
		QAISectionDto dto = new QAISectionDto().setName(test);

		String gqText = "gq test";
		dto.getGuestQuestions().add(new QAIGuestQuestionDto().setText(gqText));

		String qText = "q test";
		dto.getQuestions().add(new QAIQuestionDto().setText(qText).setCategoryId(category.getItemId()));

		String body = mapper.writeValueAsString(dto);
		RequestEntity<String> request = RequestEntity.post(new URI(url)).contentType(MediaType.APPLICATION_JSON)
				.body(body);
		ResponseEntity<QAISectionDto> response = rest.withBasicAuth(user, password).exchange(request,
				QAISectionDto.class);

		Assertions.assertEquals(HttpStatus.CREATED, response.getStatusCode(), "Should return a list");
		Assertions.assertTrue(response.getBody().getName().contentEquals(test));

		// now update it

		QAISectionDto dto2 = response.getBody();
		dto2.setName("updated");

		String body2 = mapper.writeValueAsString(dto2);
		RequestEntity<String> request2 = RequestEntity.post(new URI(url)).contentType(MediaType.APPLICATION_JSON)
				.body(body2);
		ResponseEntity<QAISectionDto> response2 = rest.withBasicAuth(user, password).exchange(request2,
				QAISectionDto.class);

		Assertions.assertEquals(HttpStatus.CREATED, response2.getStatusCode(), "Should return a list");
		Assertions.assertTrue(response2.getBody().getName().contentEquals("updated"));
	}

	public static class QAISectionDtoList extends ArrayList<QAISectionDto> {
	}

}
