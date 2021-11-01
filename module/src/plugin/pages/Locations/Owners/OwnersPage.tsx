import { EntityManager, EntityPageName } from '@sprout-platform/ui';
import React, { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { AppModuleRootState, AppModuleState } from '../../../types';
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

  useMemo(() => {
    dispatch(franchiseOwnershipStateProvider.loadState());
  }, [dispatch]);

  return (
    <div>
      <EntityManager
        entityEditor={FranchiseOwnershipEditor}
        entityListColumns={franchiseOwnershipColumns}
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
              return 'Manage the Franchise Ownership Records';
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
