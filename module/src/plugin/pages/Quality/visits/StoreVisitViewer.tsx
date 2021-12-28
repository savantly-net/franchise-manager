import { dateTime } from '@savantly/sprout-api';
import { useFMLocation } from 'plugin/pages/Locations/Stores/hooks';
import React, { Fragment } from 'react';

import { useQAISection } from '../sections/hooks';
import { useQAISectionSubmission } from '../submissions/hooks';
import { StoreVisit as EntityClass } from './entity';
import { StoreVisitFormEdit } from './storeVisitForms/StoreVisitFormEdit';
import StoreVisitTabs from './StoreVisitTabs';

export const StoreVisitViewer = ({ item }: { item: EntityClass }) => {
  const location = useFMLocation(item.locationId);
  const sectionSubmission = useQAISectionSubmission(item.sectionSubmissionId);
  const section = useQAISection(sectionSubmission?.sectionId);

  return (
    <Fragment>
      <StoreVisitTabs
        item={item}
        isVisit={true}
        isTitle={`${location?.name} / ${section?.name} / ${dateTime(item.createdDate).format('YYYY-MM-DD')}`}
      />
      <div className="mb-2">
        <h5>{item.createdDate}</h5>
        <div>
          <label className="mr-2">Location: </label>
          <span>{location?.name}</span>
        </div>
        <div>
          <label className="mr-2">Section: </label>
          <span>
            {section?.name} ({dateTime(item.createdDate).format('dd YYYY-MM-DD hh:mm A')})
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
