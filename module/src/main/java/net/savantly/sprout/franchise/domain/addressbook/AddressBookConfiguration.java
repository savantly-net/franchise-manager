package net.savantly.sprout.franchise.domain.addressbook;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import net.savantly.sprout.core.security.permissions.SproutPermissionEvaluator;

@Configuration
public class AddressBookConfiguration {

	@Bean
	public AddressBookApi addressBookApi(AddressBookEntryRepository repo) {
		return new AddressBookApi(repo);
	};
	
	@Bean
	@ConditionalOnMissingBean
	public SproutPermissionEvaluator<AddressBookEntry> defaultAddressBookPermissionEvaluator() {
		return new AddressBookPermissionEvaluator();
	}
}
