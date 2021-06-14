package net.savantly.sprout.franchise.domain;

import javax.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import net.savantly.sprout.core.domain.tenant.TenantSupport;
import net.savantly.sprout.core.tenancy.TenantKeyedRepository;

public abstract class FMCrudController<T extends TenantSupport, R extends TenantKeyedRepository<T>> {

	private final R repository;

	public FMCrudController(R repository) {
		this.repository = repository;
	}

	@GetMapping
	public ResponseEntity<Iterable<T>> getAll() {
		return ResponseEntity.ok(repository.findAll());
	}

	@GetMapping("/{itemId}")
	public ResponseEntity<T> getByItemId(@PathVariable String itemId) {
		return ResponseEntity.ok(getObjectByItemId(itemId));
	}

	@PostMapping
	public ResponseEntity<T> create(@RequestBody T object) {
		return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(object));
	}

	@PutMapping("/{itemId}")
	public ResponseEntity<T> update(@PathVariable String itemId, @RequestBody T object) {
		T existing = getObjectByItemId(itemId);
		return ResponseEntity.ok(repository.save(updateObject(existing, object)));
	}

	@DeleteMapping("/{itemId}")
	public void deleteById(@PathVariable String itemId) {
		repository.deleteByIdItemId(itemId);
	}

	/**
	 * Override this method to control the mapping of an updated object onto an
	 * existing object<br>
	 * The returned object will be persisted<br>
	 * <br>
	 * The default implementation just returns the updated object
	 * 
	 * @param existing the currently persisted object
	 * @param updated  the updates received
	 * @return the object to save
	 */
	protected T updateObject(T existing, T updated) {
		return updated;
	}

	protected T getObjectByItemId(String id) {
		return repository.findByIdItemId(id).orElseThrow(() -> new EntityNotFoundException("id: " + id));
	}
}
