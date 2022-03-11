package net.savantly.sprout.franchise.domain.qai.audit;

import java.io.File;
import java.net.URI;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.HashSet;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import net.savantly.sprout.franchise.domain.operations.qai.audit.QAADto;
import net.savantly.sprout.franchise.domain.operations.qai.audit.QAAService;
import net.savantly.sprout.franchise.domain.operations.qai.audit.QAASubmissionRepository;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.QAIGuestQuestionRepository;
import net.savantly.sprout.franchise.domain.operations.qai.question.QAIQuestionRepository;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategory;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategoryRepository;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISectionSubmissionDto;
import test.AbstractContainerBaseTest;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, classes = TestApplication.class)
public class QAAServiceTest extends AbstractContainerBaseTest {

	@Value("classpath:/qaa/submission_new.json")
	File submissionNewJson;
	
	@Autowired
	QAAService service;
	@Autowired
	TestRestTemplate rest;
	@Autowired
	ObjectMapper mapper;
	@Autowired
	QAASubmissionRepository qaaRepo;
	@Autowired
	QAIQuestionCategoryRepository categoryRepo;
	@Autowired
	QAIQuestionRepository qrepo;
	@Autowired
	QAIGuestQuestionRepository gqrepo;
	
	
	private String user = "admin";
	private String password = "changeme!";
	
	protected static String dbName = "QAASubmissionApiTest";
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
		this.qaaRepo.deleteAll();
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
		String url = "/api/fm/qaa/submission";
		RequestEntity request = RequestEntity.get(new URI(url)).accept(MediaType.APPLICATION_JSON).build();
		ResponseEntity<Object> response = rest.withBasicAuth(user, password).exchange(request, Object.class);
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode(), "Should return a list");
	}

	@Test
	public void createOne() throws Exception {

		QAIQuestionCategory category = categoryRepo.save(new QAIQuestionCategory().setName("test"));

		String test = "string";
		String url = "/api/fm/qaa/submission";
		
		
		QAADto dto = mapper.readValue(submissionNewJson, QAADto.class);

		String body = new String(Files.readAllBytes(submissionNewJson.toPath()));
		RequestEntity<String> request = RequestEntity.post(new URI(url)).contentType(MediaType.APPLICATION_JSON)
				.body(body);
		ResponseEntity<QAADto> response = rest.withBasicAuth(user, password).exchange(request,
				QAADto.class);

		Assertions.assertEquals(HttpStatus.CREATED, response.getStatusCode(), "Should create one");
		Assertions.assertTrue(response.getBody().getFsc().contentEquals(test));
	}
	
	@Test
	public void test() {
		service.save(exampleDto());
	}

	private QAADto exampleDto() {
		return new QAADto()
				.setDateScored(LocalDateTime.now())
				.setFsc("test")
				.setId("123")
				.setLocationId("234")
				.setManagerOnDuty("mod")
				.setResponsibleAlcoholCert("alcohol")
				.setSections(exampleSections());
	}

	private HashSet<QAISectionSubmissionDto> exampleSections() {
		HashSet<QAISectionSubmissionDto> result = new HashSet<>();
		result.add(new QAISectionSubmissionDto());
		return result;
	}
}
