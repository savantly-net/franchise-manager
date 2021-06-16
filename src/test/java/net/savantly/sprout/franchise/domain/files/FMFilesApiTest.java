package net.savantly.sprout.franchise.domain.files;

import java.net.URI;
import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import com.fasterxml.jackson.databind.ObjectMapper;

import example.TestApplication;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategoryRepository;
import test.AbstractContainerBaseTest;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, classes = {TestApplication.class})
public class FMFilesApiTest extends AbstractContainerBaseTest {

	private final static Logger log = LoggerFactory.getLogger(FMFilesApiTest.class);
	@Autowired
	TestRestTemplate rest;
	@Autowired
	ObjectMapper mapper;
	@Autowired
	QAIQuestionCategoryRepository categoryRepo;
	private String user = "admin";
	private String password = "changeme!";

	@Test
	public void getConfig() throws Exception {
		String url = "/api/fm/files/config";
		RequestEntity request = RequestEntity.get(new URI(url)).accept(MediaType.APPLICATION_JSON).build();
		ResponseEntity<Map> response = rest.withBasicAuth(user, password).exchange(request, Map.class);
		log.info(mapper.writeValueAsString(response.getBody()));
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode(), "Should return the config");
		Assertions.assertTrue(response.getBody().containsKey("rootFolder"));
		Assertions.assertTrue(response.getBody().containsKey("qaiFolder"));
	}

}
