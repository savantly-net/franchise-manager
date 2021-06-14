package net.savantly.sprout.franchise.domain.group;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import com.fasterxml.jackson.databind.ObjectMapper;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class FranchiseGroupApiTest {

	@Autowired
	TestRestTemplate rest;
	@Autowired
	ObjectMapper mapper;

	final private String user = "admin";
	final private String password = "changeme!";

	final String test = "test";
	final String url = "/api/fm/groups";

	static class GroupPage extends PageImpl<FranchiseGroup> {
		public GroupPage() {
			super(new ArrayList<>());
		}
		public GroupPage(List<FranchiseGroup> content) {
			super(content);
		}
	}

	@Test
	public void getItems() throws Exception {
		RequestEntity request = RequestEntity.get(new URI(url)).build();
		ResponseEntity<Map> response = rest.withBasicAuth(user, password).exchange(request, Map.class);
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode(), "Should return a page");
	}

	@Test
	public void createItem() throws Exception {
		FranchiseGroup dto = new FranchiseGroup().setName(test);

		String body = mapper.writeValueAsString(dto);
		RequestEntity<String> request0 = RequestEntity.post(new URI(url)).contentType(MediaType.APPLICATION_JSON)
				.body(body);
		ResponseEntity<FranchiseGroup> response0 = rest.withBasicAuth(user, password).exchange(request0, FranchiseGroup.class);
		Assertions.assertEquals(HttpStatus.CREATED, response0.getStatusCode(), "Should return a page");
		

		RequestEntity request1 = RequestEntity.get(new URI(url)).build();
		ResponseEntity<Map> response1 = rest.withBasicAuth(user, password).exchange(request1, Map.class);
		Assertions.assertEquals(HttpStatus.OK, response1.getStatusCode(), "Should return a page");
		
		//Assertions.assertEquals(1, response1.getBody().getNumberOfElements());
		//Assertions.assertTrue(response1.getBody().getContent().get(0).getName().contentEquals(test));
		//Assertions.assertNull(response1.getBody().getContent().get(0).getAddress1());

		// now update it

		dto.setAddress1("updated");

		String body2 = mapper.writeValueAsString(dto);
		RequestEntity<String> request2 = RequestEntity.put(new URI(url + "/" + response0.getBody().getItemId())).contentType(MediaType.APPLICATION_JSON)
				.body(body2);
		ResponseEntity<Map> response2 = rest.withBasicAuth(user, password).exchange(request2, Map.class);

		Assertions.assertEquals(HttpStatus.OK, response2.getStatusCode(), "Should return a page");
		//Assertions.assertEquals(1, response2.getBody().getNumberOfElements());
		//Assertions.assertTrue(response2.getBody().getContent().get(0).getName().contentEquals(test));
		//Assertions.assertTrue(response2.getBody().getContent().get(0).getAddress1().contentEquals("updated"));

	}

	@Configuration
	@EnableAutoConfiguration
	static class TestContext {

	}
}
