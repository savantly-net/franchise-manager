package net.savantly.sprout.franchise.domain.operations.qai;

import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;

import net.savantly.sprout.core.security.permissions.Permission;
import net.savantly.sprout.franchise.domain.operations.qai.audit.QAADto;
import net.savantly.sprout.franchise.domain.operations.qai.audit.QAASummaryDto;

public interface QAIPermissionEvaluator {
	
	default Page<QAASummaryDto> filterByPermission(Authentication authentication, Page<QAASummaryDto> summaries) {
		return summaries;
	}

	default boolean hasPermission(Authentication authentication, QAADto dto, Permission permission) {
		return true;
	}
	
	default boolean hasDeletePermission(Authentication authentication, String id) {
		return true;
	}

}
