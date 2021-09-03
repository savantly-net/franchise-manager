package net.savantly.sprout.franchise.domain.operations.qai;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import org.springframework.security.core.Authentication;

import net.savantly.sprout.core.security.permissions.Permission;
import net.savantly.sprout.core.security.permissions.SproutPermissionEvaluator;
import net.savantly.sprout.franchise.domain.operations.qai.section.QAISectionDto;

// WIP - need better way to solve permissions
public class QAIPermissionEvaluator implements SproutPermissionEvaluator<Object> {

	@Override
	public List<String> getEvaluationType() {
		return Arrays.asList(
			"net.savantly.sprout.franchise.domain.operations.qai.section.QAISectionDto"
		);
	}

	@Override
	public boolean hasPermission(Authentication authentication, Object targetDomainObject, Permission permission) {
		if (isQaiSectionDto(targetDomainObject)) {
			QAISectionDto o = coerceType(targetDomainObject, QAISectionDto.class);
			switch (permission) {
			case CREATE:
			case UPDATE:
				
				break;

			default:
				break;
			}
		}
		return false;
	}

	private <T> T coerceType(Object targetDomainObject, Class<T> clazz) {
		return (T)targetDomainObject;
	}

	private boolean isQaiSectionDto(Object targetDomainObject) {
		return Objects.nonNull(targetDomainObject) && QAISectionDto.class.isAssignableFrom(targetDomainObject.getClass());
	}

	@Override
	public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType,
			Permission permission) {
		// TODO Auto-generated method stub
		return false;
	}

}
