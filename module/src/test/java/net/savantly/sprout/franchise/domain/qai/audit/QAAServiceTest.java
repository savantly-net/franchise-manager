package net.savantly.sprout.franchise.domain.qai.audit;

import java.time.LocalDateTime;
import java.util.HashSet;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.ActiveProfiles;

import example.TestApplication;
import net.savantly.sprout.franchise.domain.operations.qai.audit.QAADto;
import net.savantly.sprout.franchise.domain.operations.qai.audit.QAAService;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISectionSubmissionDto;
import test.AbstractContainerBaseTest;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, classes = TestApplication.class)
public class QAAServiceTest extends AbstractContainerBaseTest {

	
	@Autowired
	QAAService service;
	
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
