import { getApiService } from '@savantly/sprout-runtime';
import { EntityManager, EntityPageName, LoadingIcon } from '@sprout-platform/ui';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import React, { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { AppModuleRootState, AppModuleState } from '../../types';
import { FranchiseVendor, franchiseVendorColumns, franchiseVendorStateProvider, vendorService } from './entity';
import { FranchiseVendorEditor } from './FranchiseVendorEditor';
import FranchiseVendorsViewer from './FranchiseVendorsViewer';
import VendorTypeIndexPage from './type/VendorTypeIndexPage';

const VendersIndexPage: FC<any> = ({}: AppModuleState) => {
  const vendorStat = useSelector((state: AppModuleRootState) => state.franchiseManagerState.vendorState);
  const dispatch = useDispatch();

  useMemo(() => {
    dispatch(franchiseVendorStateProvider.loadState());
  }, [dispatch]);
  const [vendorTy, setVendorTy] = useState(false);
  useMemo(() => {
    if (vendorStat.isFetched) {
      vendorStat?.response?.content.map((result: any, index: any) => {
        getApiService()
          .get(`${API_URL}/vendor-type/`)
          .then(respon => {
            const found = respon?.data?.content.filter((l: any) => l.itemId === result.typeId)?.[0]?.name;
            if (vendorStat?.response?.content) {
              vendorStat.response.content[index]['typeId'] = found;
            }
            if (vendorStat?.response?.content.length === index + 1) {
              setVendorTy(true);
            }
          })
          .catch(err => {
            console.error(err.message || err.detail || 'An error occurred while saving.');
          });
      });
      if (vendorStat?.response?.content.length === 0) {
        setVendorTy(true);
      }
    }
  }, [vendorStat, setVendorTy]);
  return (
    <div>
      {vendorStat.isFetching && <LoadingIcon />}
      {vendorTy && (
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
      )}
      <Routes>
        <Route path="/vendor-type/*" element={<VendorTypeIndexPage />} />
      </Routes>
    </div>
  );
};

export default VendersIndexPage;
