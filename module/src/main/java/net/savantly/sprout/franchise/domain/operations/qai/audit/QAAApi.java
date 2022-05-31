package net.savantly.sprout.franchise.domain.operations.qai.audit;

import java.io.IOException;

import javax.validation.constraints.NotNull;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import net.savantly.sprout.domain.file.FileData;
import net.savantly.sprout.domain.file.FileDataRequest;
import net.savantly.sprout.domain.file.FileProvider;
import net.savantly.sprout.franchise.domain.operations.qai.score.QAAScoreDto;
import net.savantly.sprout.franchise.domain.operations.qai.score.QAAScoreService;

@RestController
@RequestMapping("/api/fm/qaa/submission")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class QAAApi {

	final private QAAService service;
	final private QAAScoreService scoreService;
	final private FileProvider fileProvider;

	@GetMapping
	@Operation(summary = "Gets a page of the QAA Submissions")
	public Page<QAASummaryDto> getAll(Pageable pageable) {
		return this.service.getPage(pageable);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Gets a QAA Submission by id")
	public QAADto getOneById(@PathVariable("id") String id) {
		return this.service.getOneById(id);
	}

	@GetMapping("/{id}/score")
	@Operation(summary = "Gets a QAA Submission score by id")
	public QAAScoreDto getScoreBySubmissinId(@PathVariable("id") String id) {
		return this.scoreService.getScoreBySubmissionId(id);
	}

	@PostMapping
	@Operation(summary = "Saves a QAA Submission")
	public ResponseEntity<QAADto> save(@RequestBody QAADto qaaDto) {
		return ResponseEntity.status(201).body(service.save(qaaDto));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAuthority('QAI_ADMIN') or hasAuthority('ADMIN')")
	@Operation(summary = "Deletes a QAA Submissions")
	public void delete(@PathVariable("id") String id) {
		this.service.delete(id);
	}

	@PostMapping(path = { "/upload" }, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<FileData> uploadFile(@NotNull @RequestPart("file") MultipartFile file,
			@RequestPart("metaData") FileDataRequest request) throws IOException {
		final FileDataRequest wrappedRequest = new FileDataRequest();
		wrappedRequest.setId(request.getId())
			.setName(request.getName())
			.setParent(String.format("/FM/QA/%s", request.getParent()));
		final FileData response = this.fileProvider.storeFile(request, file);
		return ResponseEntity.ok(response);
	}
}
