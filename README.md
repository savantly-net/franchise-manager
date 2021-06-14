# Franchise Manager 

## Store Visits
An app form is used to submit data for the store visit.  

In the form builder, you can add 'disabled' fields, that are filled programmatically.  
The 'id' of the form field must match the context value name, and the field control must be able to accept the context value type.  
These fields are available as context values that can be injected into the form.  

|Description|Name|Type|Source|
|-|-|-|-|
|Manager on duty at time of QAI submission|managerOnDuty|string|section submission|

### Custom KPIs 
Custom KPIs can be injected into the store visit form.  
Implement the `KpiProvider` interface and add it to the bean context to make the KPIs available in the store visit form context [by location].  
The name of the KPI will be matched against the form control ID.  
If there's a match, the form control value will be set to the KPI value.  

### Dynamic form field values
Implement `StoreVisitDynamicFieldsProvider` to provide additional values in the new store visit form.  
The name of the field will be matched against the form control ID.  
If there's a match, the form control value will be set to the field value.  

### Section Submission Data
The selected submission for the store visit is available in the custom form context.  
This allows form fields to leverage the values in calculations, variables in URL queries, or other ways. 
Access the data at `data.sectionSubmissionData` in the form configurations.  

