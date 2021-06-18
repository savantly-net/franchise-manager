package net.savantly.sprout.franchise.domain.privilege;

import java.util.List;

import org.springframework.beans.factory.InitializingBean;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.core.domain.privilege.Privilege;
import net.savantly.sprout.core.domain.privilege.PrivilegeRepository;
import net.savantly.sprout.core.domain.tenant.TenantRepository;
import net.savantly.sprout.core.tenancy.TenantContext;

@RequiredArgsConstructor
public class FMPrivilegeContributor implements InitializingBean {
	
	final private PrivilegeRepository repo;
	final private TenantRepository tenants;

	@Override
	public void afterPropertiesSet() throws Exception {
		ensurePrivilegesExist();
	}

	private void ensurePrivilegesExist() {
		addIfNotExist(FMPrivilege.FM_ADDRESS_BOOK_ADMIN);
		addIfNotExist(FMPrivilege.FM_ADMIN);
		addIfNotExist(FMPrivilege.FM_CALENDAR_ADMIN);
		addIfNotExist(FMPrivilege.FM_KNOWLEDGE_ADMIN);
		addIfNotExist(FMPrivilege.FM_LOCATION_ADMIN);
		addIfNotExist(FMPrivilege.FM_NEWSLETTER_ADMIN);
		addIfNotExist(FMPrivilege.FM_QAI_ADMIN);
		addIfNotExist(FMPrivilege.FM_QAI_CREATE);
		addIfNotExist(FMPrivilege.FM_QAI_READ);
	}

	private void addIfNotExist(String p) {
		List<Privilege> privs = repo.findByNameAndTenantId(p, TenantContext.getCurrentTenant());
		if (privs.isEmpty()) {
			// for default tenant
			Privilege dpriv = new Privilege().setName(p);
			repo.save(dpriv);
			
			// for other tenants
			tenants.findAll().forEach(t -> {
				Privilege priv = new Privilege().setName(p);
				priv.setTenantId(t.getId());
				repo.save(priv);
			});
		}
	}

}
