import { useFMLocation } from 'plugin/pages/Locations/Stores/hooks';
import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { useQAISection } from '../sections/hooks';
import { useQAISectionSubmission } from '../submissions/hooks';
import { StoreVisit as EntityClass } from './entity';
import { StoreVisitFormEdit } from './storeVisitForms/StoreVisitFormEdit';

export const StoreVisitViewer = ({ item }: { item: EntityClass }) => {
  const location = useFMLocation(item.locationId);
  const sectionSubmission = useQAISectionSubmission(item.sectionSubmissionId);
  const section = useQAISection(sectionSubmission?.sectionId);

  return (
    <Fragment>
      <div className="mb-2">
        <h5>{item.createdDate}</h5>
        <div>
          <label className="mr-2">Location: </label>
          <span>{location?.name}</span>
        </div>
        <div>
          <label className="mr-2">Section: </label>
          <span>
            <NavLink to={`/a/franchise-manager/qai/submissions/item/${sectionSubmission?.itemId}`}>
              {section?.name} ({sectionSubmission?.dateScored})
            </NavLink>
          </span>
        </div>
      </div>
      <div>
        {item.formData && item.formData?.formId && (
          <StoreVisitFormEdit formDefinitionId={item.formData.formId} formData={item.formData} readOnly={true} />
        )}
      </div>
    </Fragment>
  );
};
