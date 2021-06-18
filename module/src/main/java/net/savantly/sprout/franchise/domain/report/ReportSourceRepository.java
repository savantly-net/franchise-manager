package net.savantly.sprout.franchise.domain.report;

import java.util.List;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;

public interface ReportSourceRepository extends TenantKeyedRepository<ReportSource> {

	List<ReportSource> findByOrderByWeightAsc();
}
