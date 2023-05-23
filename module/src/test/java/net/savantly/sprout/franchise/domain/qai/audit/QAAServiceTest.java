package net.savantly.sprout.franchise.domain.qai.audit;

import java.io.File;
import java.net.URI;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;

import javax.transaction.Transactional;

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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.wait.strategy.HostPortWaitStrategy;

import com.fasterxml.jackson.databind.ObjectMapper;

import example.TestApplication;
import net.savantly.sprout.core.tenancy.TenantedPrimaryKey;
import net.savantly.sprout.franchise.domain.operations.qai.audit.QAADto;
import net.savantly.sprout.franchise.domain.operations.qai.audit.QAAService;
import net.savantly.sprout.franchise.domain.operations.qai.audit.QAASubmissionRepository;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.QAIGuestQuestion;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.QAIGuestQuestionRepository;
import net.savantly.sprout.franchise.domain.operations.qai.question.QAIQuestion;
import net.savantly.sprout.franchise.domain.operations.qai.question.QAIQuestionRepository;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategory;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategoryRepository;
import net.savantly.sprout.franchise.domain.operations.qai.score.QAAScoreDto;
import net.savantly.sprout.franchise.domain.operations.qai.section.QAISection;
import net.savantly.sprout.franchise.domain.operations.qai.section.QAISectionRepository;
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
	QAISectionRepository qsrepo;
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
		this.qsrepo.deleteAll();
		
	}

	private QAIGuestQuestion getExampleGuestQuestion() {
		QAIGuestQuestion q = new QAIGuestQuestion();
		TenantedPrimaryKey id = new TenantedPrimaryKey();
		id.setItemId("1");
		q.setId(id);
		return q;
	}

	private QAIQuestion exampleQuestion() {
		QAIQuestion q = new QAIQuestion();
		TenantedPrimaryKey id = new TenantedPrimaryKey();
		id.setItemId("1");
		q.setId(id);
		return q;
	}

	private QAIQuestionCategory getExampleCategory() {
		QAIQuestionCategory cat = new QAIQuestionCategory();
		TenantedPrimaryKey id = new TenantedPrimaryKey();
		id.setItemId("1");
		cat.setName("test");
		return cat;
	}

	private QAISection getExampleSection() {
		QAISection s = new QAISection();
		TenantedPrimaryKey key = new TenantedPrimaryKey();
		key.setItemId("1");
		s.setId(key);
		return s.setName("test");
	}

	private QAISection getExampleSection2() {
		QAISection s = new QAISection();
		TenantedPrimaryKey key = new TenantedPrimaryKey();
		key.setItemId("2");
		s.setId(key);
		return s.setName("test");
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
		

		QAIQuestionCategory cat = this.categoryRepo.save(getExampleCategory());
		QAIQuestion q = exampleQuestion();
		q.setTags("tag");
		q.setCategory(cat);
		
		QAIGuestQuestion gq = this.gqrepo.save(getExampleGuestQuestion());
		
		this.qsrepo.save(getExampleSection());
		this.qsrepo.save(getExampleSection2());
		this.qrepo.save(q);
		this.qsrepo.flush();

		String test = "string";
		String url = "/api/fm/qaa/submission";
		
		
		QAADto dto = mapper.readValue(submissionNewJson, QAADto.class);


		String body = new String(Files.readAllBytes(submissionNewJson.toPath()));
		RequestEntity<String> request = RequestEntity.post(new URI(url)).contentType(MediaType.APPLICATION_JSON)
				.body(body);
		ResponseEntity<QAADto> response = rest.withBasicAuth(user, password).exchange(request,
				QAADto.class);

		Assertions.assertEquals(HttpStatus.CREATED, response.getStatusCode(), "Should create one");
		Assertions.assertNotNull(response.getBody());
		QAADto resultBody = response.getBody();

		Assertions.assertNotNull(resultBody.getId());
		Assertions.assertTrue(resultBody.getFsc().contentEquals(test));
		Assertions.assertTrue(resultBody.getLocationId().contentEquals(test));
		
		Assertions.assertEquals(dto.getDateScored(), resultBody.getDateScored());
		Assertions.assertEquals(dto.getSections().size(), resultBody.getSections().size());
		
		ResponseEntity<QAAScoreDto> response2 = rest.withBasicAuth(user, password)
				.getForEntity(new URI(String.format("%s/%s/score", url, resultBody.getId())),
				QAAScoreDto.class);
		Assertions.assertEquals(HttpStatus.OK, response2.getStatusCode(), "Should be a valid status code");
		Assertions.assertEquals(1, response2.getBody().getOverallScore(), "Should get oeverall score");
		Assertions.assertEquals(2, response2.getBody().getSections().size(), "Should have the correct number of sections submitted");

		// Save it again to make sure it doesn't fail
		ResponseEntity<QAADto> response3 = rest.withBasicAuth(user, password).exchange(request,
				QAADto.class);
	}
	
	@Test
	@Transactional
	@WithMockUser(authorities = "ADMIN")
	public void test() {

		this.qsrepo.save(getExampleSection());
		service.save(exampleDto());
	}

	private QAADto exampleDto() {
		return new QAADto()
				.setDateScored(LocalDate.now())
				.setStartTime(LocalTime.now())
				.setFsc("test")
				.setId("123")
				.setLocationId("234")
				.setManagerOnDuty("mod")
				.setResponsibleAlcoholCert("alcohol")
				.setSections(exampleSections());
	}

	private HashSet<QAISectionSubmissionDto> exampleSections() {
		HashSet<QAISectionSubmissionDto> result = new HashSet<>();
		result.add(new QAISectionSubmissionDto().setSectionId("1"));
		return result;
	}
}
