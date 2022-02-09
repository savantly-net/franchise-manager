package net.savantly.sprout.franchise.domain.location;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Assertions;
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

import example.TestApplication;
import net.savantly.sprout.franchise.domain.bar.FranchiseBarDto;
import net.savantly.sprout.franchise.domain.hours.FranchiseHoursOfOperationModifierDto;
import net.savantly.sprout.franchise.domain.locationOpenDateInterval.LocationOpenDateIntervalDto;
import test.AbstractContainerBaseTest;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, classes = TestApplication.class)
public class LocationApiTest extends AbstractContainerBaseTest {

	@Autowired
	TestRestTemplate rest;
	@Autowired
	ObjectMapper mapper;
	private String user = "admin";
	private String password = "changeme!";
	
	@Test
	public void getLocations() throws Exception {
		String url = "/api/fm/locations";
		RequestEntity request = RequestEntity.get(new URI(url)).build();
		ResponseEntity<FranchiseLocationDtoList> response = rest.withBasicAuth(user, password).exchange(request, FranchiseLocationDtoList.class);
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode(), "Should return a list");
	}
	
	@Test
	public void createLocation() throws Exception {
		String test = "test";
		String url = "/api/fm/locations";
		LocalDate testDate = LocalDate.now();
		Set<LocationOpenDateIntervalDto> openDateIntervals = new HashSet<>();
		openDateIntervals.add(new LocationOpenDateIntervalDto().setStart(testDate).setEnd(testDate));
		FranchiseLocationDto dto = new FranchiseLocationDto()
				.setAddress1(test)
				.setAddress2(test)
				.setCity(test)
				.setConcept(LocationConcept.TRADITIONAL)
				.setCountry(test)
				.setLocationType(LocationType.STANDALONE)
				.setMarketId(test)
				.setName(test)
				.setPhoneNumber(123L)
				.setState(test)
				.setZip(test)
				.setDateOpened(testDate)
				.setDateClosed(testDate)
				.setOpenDateIntervals(openDateIntervals);
		
		dto.getBars().add(new FranchiseBarDto().setBeer(true));
		LocalTime closeTime = LocalTime.now();
		dto.getModifiedHours().add(new FranchiseHoursOfOperationModifierDto().setCloseTime(closeTime));
		
		String body = mapper.writeValueAsString(dto);
		RequestEntity<String> request = RequestEntity.post(new URI(url)).contentType(MediaType.APPLICATION_JSON).body(body);
		ResponseEntity<FranchiseLocationDto> response = rest.withBasicAuth(user, password).exchange(request, FranchiseLocationDto.class);
		
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode(), "Should return a list");
		Assertions.assertTrue(response.getBody().getAddress1().contentEquals(test));
		Assertions.assertTrue(response.getBody().getAddress2().contentEquals(test));
		Assertions.assertTrue(response.getBody().getCity().contentEquals(test));
		Assertions.assertTrue(response.getBody().getCountry().contentEquals(test));
		Assertions.assertTrue(response.getBody().getMarketId().contentEquals(test));
		Assertions.assertTrue(response.getBody().getName().contentEquals(test));
		Assertions.assertTrue(response.getBody().getState().contentEquals(test));
		Assertions.assertTrue(response.getBody().getZip().contentEquals(test));

		Assertions.assertTrue(response.getBody().getBuilding().getId().contentEquals(response.getBody().getId()));
		Assertions.assertEquals(response.getBody().getHours(), dto.getHours());
		Assertions.assertTrue(response.getBody().getPos().getId().contentEquals(response.getBody().getId()));

		Assertions.assertEquals(LocationConcept.TRADITIONAL, response.getBody().getConcept());
		Assertions.assertEquals(LocationType.STANDALONE, response.getBody().getLocationType());
		Assertions.assertEquals(123L, response.getBody().getPhoneNumber());
		
		Assertions.assertEquals(testDate, response.getBody().getDateOpened());
		Assertions.assertEquals(testDate, response.getBody().getDateClosed());
		Assertions.assertEquals(testDate, response.getBody().getOpenDateIntervals().stream().findFirst().orElseThrow(() -> new RuntimeException("missing openDateIntervals")));
		
		// now update it
		
		dto.setAddress1("updated");

		String body2 = mapper.writeValueAsString(dto);
		RequestEntity<String> request2 = RequestEntity.post(new URI(url)).contentType(MediaType.APPLICATION_JSON).body(body2);
		ResponseEntity<FranchiseLocationDto> response2 = rest.withBasicAuth(user, password).exchange(request2, FranchiseLocationDto.class);

		Assertions.assertEquals(HttpStatus.OK, response2.getStatusCode(), "Should return a list");
		Assertions.assertTrue(response2.getBody().getAddress1().contentEquals("updated"));
		Assertions.assertTrue(response2.getBody().getAddress2().contentEquals(test));
		Assertions.assertTrue(response2.getBody().getCity().contentEquals(test));
		Assertions.assertTrue(response2.getBody().getCountry().contentEquals(test));
		Assertions.assertTrue(response2.getBody().getMarketId().contentEquals(test));
		Assertions.assertTrue(response2.getBody().getName().contentEquals(test));
		Assertions.assertTrue(response2.getBody().getState().contentEquals(test));
		Assertions.assertTrue(response2.getBody().getZip().contentEquals(test));

		Assertions.assertTrue(response2.getBody().getBuilding().getId().contentEquals(response2.getBody().getId()));
		Assertions.assertTrue(response2.getBody().getPos().getId().contentEquals(response2.getBody().getId()));

		Assertions.assertEquals(LocationConcept.TRADITIONAL, response2.getBody().getConcept());
		Assertions.assertEquals(LocationType.STANDALONE, response2.getBody().getLocationType());
		Assertions.assertEquals(123L, response2.getBody().getPhoneNumber());
		
	}
	
	public static class FranchiseLocationDtoList extends ArrayList<FranchiseLocationDto> {}

}
