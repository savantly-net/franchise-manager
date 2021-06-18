package net.savantly.sprout.franchise.domain.operations.qai.section;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fm/qai/section")
public class QAISectionApi {

	private final QAISectionService service;

	public QAISectionApi(QAISectionService service) {
		this.service = service;
	}

	@GetMapping
	public ResponseEntity<List<QAISectionDto>> getAll() {
		return ResponseEntity.ok(service.findAll());
	}

	@GetMapping("/{itemId}")
	public ResponseEntity<QAISectionDto> getByItemId(@PathVariable String itemId) {
		return ResponseEntity.ok(service.findByItemId(itemId));
	}

	@PostMapping
	public ResponseEntity<QAISectionDto> create(@RequestBody QAISectionDto object) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.create(object));
	}

	@PutMapping("/{itemId}")
	public ResponseEntity<QAISectionDto> update(@PathVariable String itemId, @RequestBody QAISectionDto object) {
		return ResponseEntity.ok(service.update(object));
	}

	@DeleteMapping("/{itemId}")
	public void deleteById(@PathVariable String itemId) {
		service.deleteById(itemId);
	}

}
