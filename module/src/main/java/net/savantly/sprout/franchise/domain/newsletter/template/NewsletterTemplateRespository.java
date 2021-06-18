package net.savantly.sprout.franchise.domain.newsletter.template;

import net.savantly.sprout.core.tenancy.TenantedJpaRepository;
import net.savantly.sprout.core.tenancy.TenantedPrimaryKey;

public interface NewsletterTemplateRespository extends TenantedJpaRepository<NewsletterTemplate, TenantedPrimaryKey> {

}
