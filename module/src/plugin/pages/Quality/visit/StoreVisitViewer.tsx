import { dateTime } from '@savantly/sprout-api';
import { useFMLocation } from 'plugin/pages/Locations/Stores/hooks';
import React, { Fragment } from 'react';
import { StoreVisit as EntityClass } from './entity';
import { StoreVisitFormEdit } from './storeVisitForms/StoreVisitFormEdit';
import StoreVisitTabs from './StoreVisitTabs';

export const StoreVisitViewer = ({ item }: { item: EntityClass }) => {
  const location = useFMLocation(item.locationId);

  return (
    <Fragment>
      <StoreVisitTabs
        item={item}
        isVisit={true}
        isTitle={`${location?.name}/ ${dateTime(item.createdDate).format('YYYY-MM-DD')}`}
      />
      <div className="mb-2">
        <h5>{item.createdDate}</h5>
        <div>
          <label className="mr-2">Location: </label>
          <span>{location?.name}</span>
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
