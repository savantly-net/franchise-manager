import { AppPluginMeta } from '@savantly/sprout-api';
import { ColumnDescription, EntityManager, EntityPageName } from '@sprout-platform/ui';
import { useFMLocation } from 'plugin/pages/Locations/Stores/hooks';
import React, { FC } from 'react';
import { AppModuleRootState, AppPluginSettings } from '../../../types';
import { useQAISection } from '../sections/hooks';
import { useQAISectionSubmission } from '../submissions/hooks';
import {
  StoreVisit as EntityClass,
  storeVisitService as service,
  storeVisitStateProvider as stateProvider,
} from './entity';
import { StoreVisitEditor as EntityEditor } from './StoreVisitEditor';
import { StoreVisitViewer as Viewer } from './StoreVisitViewer';

const LocationName = ({ locationId }: { locationId?: string }) => {
  const location = useFMLocation(locationId);
  return <span className="mr-1">{location?.name}</span>;
};

const SectionName = ({ sectionSubmissionId }: { sectionSubmissionId?: string }) => {
  const sectionSubmission = useQAISectionSubmission(sectionSubmissionId);
  const section = useQAISection(sectionSubmission?.sectionId);

  return <span className="mr-1">({section?.name})</span>;
};

const columns: Array<ColumnDescription<EntityClass>> = [
  {
    dataField: 'dummy',
    text: 'Name',
    sort: true,
    isDummyField: true,
    formatter: (cell, row) => {
      return (
        <span>
          <LocationName locationId={row.locationId} />
          <SectionName sectionSubmissionId={row.sectionSubmissionId} />
          {row.createdDate}
        </span>
      );
    },
  },
];

const IndexPage: FC<any> = ({ meta }: { meta: AppPluginMeta<AppPluginSettings> }) => {
  const stateSelector = (state: AppModuleRootState) => state.franchiseManagerState.storeVisits;
  return (
    <EntityManager
      entityEditor={EntityEditor}
      entityListColumns={columns}
      entityService={service}
      entityStateProvider={stateProvider}
      entityStateSelector={stateSelector}
      entityViewer={Viewer}
      iconProvider={({ item, pageName }: { item?: EntityClass; pageName: EntityPageName }) => {
        return '';
      }}
      subTitleProvider={({ item, pageName }: { item?: EntityClass; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'Create a new Store Visit';
          case 'edit':
            return '';
          case 'list':
            return 'Manage the Store Visits';
          case 'view':
            return '';
          default:
            return '';
        }
      }}
      titleProvider={({ item, pageName }: { item?: EntityClass; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'New Store Visit';
          case 'edit':
            return `Editing the Store Visit: ${item?.itemId}`;
          case 'list':
            return 'All Store Visits';
          case 'view':
            return '';
          default:
            return '';
        }
      }}
    />
  );
};

export default IndexPage;
