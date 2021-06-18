package net.savantly.sprout.franchise.domain.fee;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.rest.crud.TenantedDtoController;

@RestController
@RequestMapping("/api/fm/fees")
public class FranchiseFeeApi extends TenantedDtoController<FranchiseFee, FranchiseFeeDto> {
	

	private final FranchiseFeeService service;

	public FranchiseFeeApi(TenantKeyedRepository<FranchiseFee> repository, FranchiseFeeService service) {
		super(repository);
		this.service = service;
	}
	
	@PostMapping("/import")
	public ResponseEntity<Void> bulkImport(@RequestBody List<FranchiseFeeDto> fees) {
		service.bulkImport(fees);
		return ResponseEntity.ok().build();
	}

	@Override
	protected FranchiseFeeDto convert(FranchiseFee object) {
		return service.convert(object);
	}

	@Override
	protected FranchiseFee createEntity(FranchiseFeeDto object) {
		return service.createEntity(object);
	}

	@Override
	protected FranchiseFee updateEntity(FranchiseFee entity, FranchiseFeeDto object) {
		return service.updateEntity(entity, object);
	}

}
