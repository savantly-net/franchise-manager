package net.savantly.sprout.franchise.domain.operations.qai.section.submission;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.rest.crud.TenantedDtoController;

@RestController
@RequestMapping("/api/fm/qai/submission")
public class QAISectionSubmissionApi extends TenantedDtoController<QAISectionSubmission, QAISectionSubmissionDto> {

	private final QAISubmissionService service;

	public QAISectionSubmissionApi(TenantKeyedRepository<QAISectionSubmission> repository,
			QAISubmissionService service) {
		super(repository);
		this.service = service;
	}
	
	@GetMapping("/findByLocation/{locationId}")
	public ResponseEntity<List<QAISectionSubmissionDto>> getSubmissionsByLocationId(@PathVariable("locationId") String locationId) {
		return ResponseEntity.ok(service.findByLocation(locationId));
	}

	@Override
	protected QAISectionSubmission createEntity(QAISectionSubmissionDto object) {
		return service.createEntity(object);
	}

	@Override
	protected QAISectionSubmission updateEntity(QAISectionSubmission entity, QAISectionSubmissionDto object) {
		return service.updateEntity(entity, object);
	}

	@Override
	protected QAISectionSubmissionDto convert(QAISectionSubmission entity) {
		return service.convert(entity);
	}

}
