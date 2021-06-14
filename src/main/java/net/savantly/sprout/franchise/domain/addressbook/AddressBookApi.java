package net.savantly.sprout.franchise.domain.addressbook;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.rest.crud.TenantedDtoController;

@RestController
@RequestMapping("/api/fm/addressbook")
public class AddressBookApi extends TenantedDtoController<AddressBookEntry, AddressBookEntry> {

	public AddressBookApi(TenantKeyedRepository<AddressBookEntry> repository) {
		super(repository);
	}

	@Override
	protected AddressBookEntry convert(AddressBookEntry object) {
		return object;
	}

	@Override
	protected AddressBookEntry createEntity(AddressBookEntry object) {
		return object;
	}

	@Override
	protected AddressBookEntry updateEntity(AddressBookEntry entity, AddressBookEntry object) {
		return object;
	}
}
