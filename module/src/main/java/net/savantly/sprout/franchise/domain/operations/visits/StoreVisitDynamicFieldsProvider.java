package net.savantly.sprout.franchise.domain.operations.visits;

import java.util.Map;

/**
 * Implement this interface to provide the Store Visit creation form with values to insert into the fields.
 * 
 * @author jeremybranham
 *
 */
public interface StoreVisitDynamicFieldsProvider {
	
	Map<String, Object> getDynamicFields(String locationId);
}
