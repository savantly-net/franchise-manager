package net.savantly.sprout.franchise.domain.kpi;

import java.util.Map;

/**
 * Implementations should provide key/value pairs of KPI metrics.
 * 
 * @author jeremy branham
 *
 */
public interface KpiProvider {

	Map<String, Object> getKpis();
	
	Map<String, Object> getKpis(String locationId);
	
}
