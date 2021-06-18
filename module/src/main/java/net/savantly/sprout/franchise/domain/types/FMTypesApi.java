package net.savantly.sprout.franchise.domain.types;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import net.savantly.sprout.franchise.domain.location.LocationConcept;
import net.savantly.sprout.franchise.domain.location.LocationType;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/fm/types")
public class FMTypesApi {

	@GetMapping
	@Operation(summary = "Get options for UI Select boxes")
	public Map<String, List<String>> getAll() {
		Map<String, List<String>> response = new HashMap<>();
		response.put("concepts", getConcepts());
		response.put("locationTypes", getLocationTypes());
		return response;
	}

	@GetMapping("/concepts")
	@Operation(summary = "Get available Location Concept Types")
	public List<String> getConcepts() {
		return Arrays.asList(LocationConcept.values()).stream().map(t -> t.name()).collect(Collectors.toList());
	}

	@GetMapping("/location-types")
	@Operation(summary = "Get available Location Types")
	public List<String> getLocationTypes() {
		return Arrays.asList(LocationType.values()).stream().map(t -> t.name()).collect(Collectors.toList());
	}
}
