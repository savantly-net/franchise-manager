package net.savantly.sprout.franchise.domain.operations.qai.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/fm/qaa/submission")
@RequiredArgsConstructor
public class QAAApi {

	final private QAAService service;

	@GetMapping
	@Operation(summary = "Gets a page of the QAA Submissions")
	public Page<QAADto> getAll(Pageable pageable) {
		return this.service.getPage(pageable);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Gets a page of the QAA Submissions")
	public QAADto getOneById(@PathVariable("id") String id) {
		return this.service.getOneById(id);
	}

	@PostMapping
	@Operation(summary = "Saves a QAA Submission")
	public QAADto save(@RequestBody QAADto qaaDto) {
		return this.service.save(qaaDto);
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Deletes a QAA Submissions")
	public void delete(@PathVariable("id") String id) {
		this.service.delete(id);
	}
}
