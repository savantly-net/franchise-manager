import { ColumnDescription, EntityManager, EntityPageName } from '@sprout-platform/ui';
import React, { FC, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppModuleRootState, AppModuleState } from '../../../types';
import { useFMGroups } from '../Groups/hooks';
import { useFMLocations } from '../Stores/hooks';
import {
  FranchiseOwnership,
  franchiseOwnershipColumns,
  franchiseOwnershipService,
  franchiseOwnershipStateProvider,
} from './entity';
import { FranchiseOwnershipEditor } from './FranchiseOwnershipEditor';
import FranchiseOwnershipViewer from './FranchiseOwnershipViewer';

const OwnersPage: FC<any> = ({}: AppModuleState) => {
  const dispatch = useDispatch();
  const locations = useFMLocations();
  const groups = useFMGroups();

  const [columns, setColumns] = useState([] as Array<ColumnDescription<FranchiseOwnership>>);

  useMemo(() => {
    if (groups && locations) {
      setColumns(franchiseOwnershipColumns(locations, groups));
    }
  }, [locations, groups]);

  useMemo(() => {
    dispatch(franchiseOwnershipStateProvider.loadState());
  }, [dispatch]);

  const isLoadingLocations = locations.length === 0 ? <div>Loading Locations...</div> : undefined;
  const isLoadingGroups = groups && groups?.length === 0 ? <div>Loading Groups...</div> : undefined;

  if (isLoadingGroups || isLoadingLocations) {
    return (
      <div>
        {isLoadingGroups}
        {isLoadingLocations}
      </div>
    );
  }

  return (
    <div>
      <EntityManager
        entityEditor={FranchiseOwnershipEditor}
        entityListColumns={columns}
        entityService={franchiseOwnershipService}
        entityStateProvider={franchiseOwnershipStateProvider}
        entityStateSelector={(state: AppModuleRootState) => state.franchiseManagerState.ownershipState}
        entityViewer={FranchiseOwnershipViewer}
        iconProvider={({ item, pageName }: { item?: FranchiseOwnership; pageName: EntityPageName }) => {
          return 'Franchise Ownership';
        }}
        subTitleProvider={({ item, pageName }: { item?: FranchiseOwnership; pageName: EntityPageName }) => {
          switch (pageName) {
            case 'create':
              return 'Franchise Ownership Records';
            case 'edit':
              return '';
            case 'list':
              return 'A Store ID is assigned to a  `location` and associated with a `development group`';
            case 'view':
              return '';
            default:
              return '';
          }
        }}
        titleProvider={({ item, pageName }: { item?: FranchiseOwnership; pageName: EntityPageName }) => {
          switch (pageName) {
            case 'create':
              return 'Create a Franchise Ownership Record';
            case 'edit':
              return `Editing the Franchise Ownership: ${item?.incorporatedName}`;
            case 'list':
              return 'All Franchise Ownership Records';
            case 'view':
              return item?.incorporatedName || '';
            default:
              return '';
          }
        }}
      />
    </div>
  );
};

export default OwnersPage;
