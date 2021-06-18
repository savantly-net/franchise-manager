import { EntityManager, EntityPageName } from '@sprout-platform/ui';
import React, { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { AppModuleRootState, AppModuleState } from '../../../types';
import { FranchiseGroup, franchiseGroupColumns, franchiseGroupsStateProvider, groupService } from './entity';
import { FranchiseGroupEditor } from './FranchiseGroupEditor';
import FranchiseGroupViewer from './FranchiseGroupViewer';

const GroupsPage: FC<any> = ({}: AppModuleState) => {
  //const state = useSelector((state: AppModuleRootState) => state.franchiseManagerState.groupState);
  const dispatch = useDispatch();

  useMemo(() => {
    dispatch(franchiseGroupsStateProvider.loadState());
  }, [dispatch]);

  return (
    <div>
      <EntityManager
        entityEditor={FranchiseGroupEditor}
        entityListColumns={franchiseGroupColumns}
        entityService={groupService}
        entityStateProvider={franchiseGroupsStateProvider}
        entityStateSelector={(state: AppModuleRootState) => state.franchiseManagerState.groupState}
        entityViewer={FranchiseGroupViewer}
        iconProvider={({ item, pageName }: { item?: FranchiseGroup; pageName: EntityPageName }) => {
          return 'Franchise Group';
        }}
        subTitleProvider={({ item, pageName }: { item?: FranchiseGroup; pageName: EntityPageName }) => {
          switch (pageName) {
            case 'create':
              return 'Locations and people are associated to franchise groups';
            case 'edit':
              return '';
            case 'list':
              return 'Manage the Franchise Groups';
            case 'view':
              return '';
            default:
              return '';
          }
        }}
        titleProvider={({ item, pageName }: { item?: FranchiseGroup; pageName: EntityPageName }) => {
          switch (pageName) {
            case 'create':
              return 'Create a Franchise Group';
            case 'edit':
              return `Editing the Group: ${item?.name}`;
            case 'list':
              return 'All Franchise Groups';
            case 'view':
              return item?.name || '';
            default:
              return '';
          }
        }}
      />
    </div>
  );
};

export default GroupsPage;
