package net.savantly.sprout.franchise.domain.addressbook;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

import org.springframework.security.core.Authentication;

import net.savantly.sprout.core.security.permissions.Permission;
import net.savantly.sprout.core.security.permissions.SproutPermissionEvaluator;
import net.savantly.sprout.franchise.domain.privilege.FMPrivilege;

public class AddressBookPermissionEvaluator implements SproutPermissionEvaluator<AddressBookEntry> {

	@Override
	public List<String> getEvaluationType() {
		return Arrays.asList(AddressBookEntry.class.getName());
	}

	@Override
	public boolean hasPermission(Authentication authentication, AddressBookEntry targetDomainObject,
			Permission permission) {
		return simpleEval(authentication, permission);
	}

	@Override
	public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType,
			Permission permission) {
		return simpleEval(authentication, permission);
	}

	private boolean simpleEval(Authentication authentication, Permission permission) {
		switch (permission) {
		case CREATE:
		case UPDATE:
		case DELETE:
			return authentication.getAuthorities().stream().anyMatch(p -> p.getAuthority().contentEquals(FMPrivilege.FM_ADDRESS_BOOK_ADMIN));
		case READ:
			return true;
		default:
			break;
		}
		return false;
	}


}
