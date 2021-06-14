package net.savantly.sprout.franchise.domain.kpi;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/fm/kpi")
@AllArgsConstructor
public class KpiApi {

	private final KpiProvider provider;
	
	@GetMapping
	public Map<String, Object> getKpis() {
		return provider.getKpis();
	}

	@GetMapping("/{locationId}")
	public Map<String, Object> getKpis(@PathVariable("locationId") String locationId) {
		return provider.getKpis(locationId);
	}
}
