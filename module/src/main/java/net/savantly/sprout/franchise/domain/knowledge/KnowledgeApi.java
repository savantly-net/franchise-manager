package net.savantly.sprout.franchise.domain.knowledge;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.rest.crud.TenantedDtoController;

@RestController
@RequestMapping("/api/fm/knowledge")
public class KnowledgeApi extends TenantedDtoController<Knowledge, Knowledge> {

	public KnowledgeApi(KnowledgeRepository repository) {
		super(repository);
	}

	@Override
	protected Knowledge convert(Knowledge object) {
		return object;
	}

	@Override
	protected Knowledge createEntity(Knowledge object) {
		return object;
	}

	@Override
	protected Knowledge updateEntity(Knowledge entity, Knowledge object) {
		return object;
	}

}
