package net.savantly.sprout.franchise.domain.qai.section.submission;


import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import com.fasterxml.jackson.databind.ObjectMapper;

import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.QAIGuestQuestionDto;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answer.QAIGuestQuestionAnswerDto;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answer.QAIGuestQuestionAnswerType;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answerGroup.QAIGuestQuestionAnswerGroupDto;
import net.savantly.sprout.franchise.domain.operations.qai.question.QAIQuestionDto;
import net.savantly.sprout.franchise.domain.operations.qai.question.answer.QAIQuestionAnswerDto;
import net.savantly.sprout.franchise.domain.operations.qai.question.answer.QAIQuestionAnswerType;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategory;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategoryRepository;
import net.savantly.sprout.franchise.domain.operations.qai.section.QAISectionApi;
import net.savantly.sprout.franchise.domain.operations.qai.section.QAISectionDto;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISectionSubmissionDto;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISubmissionState;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class QAISectionSubmissionApiTest {

	@Autowired
	TestRestTemplate rest;
	@Autowired
	ObjectMapper mapper;
	@Autowired
	QAIQuestionCategoryRepository categoryRepo;
	@Autowired
	QAISectionApi sectionApi;
	
	private String user = "admin";
	private String password = "changeme!";

	@Test
	public void getAll() throws Exception {
		String url = "/api/fm/qai/submission";
		RequestEntity request = RequestEntity.get(new URI(url)).accept(MediaType.APPLICATION_JSON).build();
		ResponseEntity<Object> response = rest.withBasicAuth(user, password).exchange(request, Object.class);
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode(), "Should return a list");
	}

	@Test
	public void createOne() throws Exception {

		
		ResponseEntity<QAISectionDto> section = sectionApi.create(mockSection());

		String test = "test";
		String url = "/api/fm/qai/submission";
		
		Map<String, String> staffAttendance = new HashMap<>();
		staffAttendance.put("test", "person");
		
		QAISectionSubmissionDto dto = new QAISectionSubmissionDto()
				.setAnswers(mockAnswers(section.getBody()))
				.setGuestAnswers(mockGuestAnswerGroups(section.getBody()))
				.setManagerOnDuty("MOD")
				.setStaffAttendance(staffAttendance)
				.setStatus(QAISubmissionState.DRAFT);


		String body = mapper.writeValueAsString(dto);
		RequestEntity<String> request = RequestEntity.post(new URI(url)).contentType(MediaType.APPLICATION_JSON)
				.body(body);
		ResponseEntity<QAISectionSubmissionDto> response = rest.withBasicAuth(user, password).exchange(request,
				QAISectionSubmissionDto.class);

		Assertions.assertEquals(HttpStatus.CREATED, response.getStatusCode(), "Should return created");
		Assertions.assertTrue(response.getBody().getManagerOnDuty().contentEquals("MOD"));
		Assertions.assertEquals(1, response.getBody().getGuestAnswers().size());
		Assertions.assertEquals(1, response.getBody().getAnswers().size());

		// now update it

		QAISectionSubmissionDto dto2 = response.getBody();
		dto2.setManagerOnDuty("NEW");

		String body2 = mapper.writeValueAsString(dto2);
		RequestEntity<String> request2 = RequestEntity.put(new URI(url + "/" + dto2.getItemId())).contentType(MediaType.APPLICATION_JSON)
				.body(body2);
		ResponseEntity<QAISectionSubmissionDto> response2 = rest.withBasicAuth(user, password).exchange(request2,
				QAISectionSubmissionDto.class);

		Assertions.assertEquals(HttpStatus.OK, response2.getStatusCode(), "Should return ok");
		Assertions.assertTrue(response.getBody().getManagerOnDuty().contentEquals("NEW"));
		Assertions.assertEquals(1, response.getBody().getGuestAnswers().size());
		Assertions.assertEquals(1, response.getBody().getAnswers().size());
	}

	private List<QAIGuestQuestionAnswerGroupDto> mockGuestAnswerGroups(QAISectionDto body) {
		List<QAIGuestQuestionAnswerGroupDto> list = new ArrayList<>();
		list.add(new QAIGuestQuestionAnswerGroupDto()
				.setAnswers(mockGuestAnswers(body)));
		return list;
	}

	private List<QAIGuestQuestionAnswerDto> mockGuestAnswers(QAISectionDto body) {
		List<QAIGuestQuestionAnswerDto> list = new ArrayList<>();
		list.add(new QAIGuestQuestionAnswerDto()
				.setGuestQuestionId(body.getGuestQuestions().get(0).getItemId())
				.setValue(QAIGuestQuestionAnswerType.NO));
		return list;
	}

	private List<QAIQuestionAnswerDto> mockAnswers(QAISectionDto body) {
		List<QAIQuestionAnswerDto> list = new ArrayList<>();
		list.add(new QAIQuestionAnswerDto().setNotes("NOTES")
				.setQuestionId(body.getQuestions().get(0).getItemId())
				.setValue(QAIQuestionAnswerType.YES));
		return list;
	}

	private QAISectionDto mockSection() {
		return new QAISectionDto()
			.setGuestQuestions(mockGuestQuestions())
			.setName("test")
			.setQuestions(mockQuestions());
	}

	private List<QAIQuestionDto> mockQuestions() {

		QAIQuestionCategory category = categoryRepo.save(new QAIQuestionCategory().setName("test"));
		
		List<QAIQuestionDto> list = new ArrayList<>();
		list.add(new QAIQuestionDto()
				.setCategoryId(category.getItemId())
				.setPoints(2)
				.setText("TEST QUESTION"));
		return list;
	}

	private List<QAIGuestQuestionDto> mockGuestQuestions() {
		List<QAIGuestQuestionDto> list = new ArrayList<>();
		list.add(new QAIGuestQuestionDto()
				.setText("TEST QUESTION"));
		return list;
	}


	@Configuration
	@EnableAutoConfiguration
	static class TestContext {

	}
}
