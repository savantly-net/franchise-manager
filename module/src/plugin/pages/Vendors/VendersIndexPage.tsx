import { EntityManager, EntityPageName } from '@sprout-platform/ui';
import React, { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { AppModuleRootState, AppModuleState } from '../../types';
import { FranchiseVendor, franchiseVendorColumns, franchiseVendorStateProvider, vendorService } from './entity';
import { FranchiseVendorEditor } from './FranchiseVendorEditor';
import FranchiseVendorsViewer from './FranchiseVendorsViewer';

const VendersIndexPage: FC<any> = ({}: AppModuleState) => {
  //const state = useSelector((state: AppModuleRootState) => state.franchiseManagerState.groupState);
  const dispatch = useDispatch();

  useMemo(() => {
    dispatch(franchiseVendorStateProvider.loadState());
  }, [dispatch]);

  return (
    <div>
      <EntityManager
        entityEditor={FranchiseVendorEditor}
        entityListColumns={franchiseVendorColumns}
        entityService={vendorService}
        entityStateProvider={franchiseVendorStateProvider}
        entityStateSelector={(state: AppModuleRootState) => state.franchiseManagerState.vendorState}
        entityViewer={FranchiseVendorsViewer}
        iconProvider={({ item, pageName }: { item?: FranchiseVendor; pageName: EntityPageName }) => {
          return 'Franchise Vendor';
        }}
        subTitleProvider={({ item, pageName }: { item?: FranchiseVendor; pageName: EntityPageName }) => {
          switch (pageName) {
            case 'create':
              return 'Locations and people are associated to franchise vendors';
            case 'edit':
              return '';
            case 'list':
              return 'Manage the Franchise Vendors';
            case 'view':
              return '';
            default:
              return '';
          }
        }}
        titleProvider={({ item, pageName }: { item?: FranchiseVendor; pageName: EntityPageName }) => {
          switch (pageName) {
            case 'create':
              return 'Create a Franchise Vendors';
            case 'edit':
              return `Editing the Vendor: ${item?.name}`;
            case 'list':
              return 'All Franchise Vendors';
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

export default VendersIndexPage;
