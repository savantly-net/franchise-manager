import { NavModel, NavModelItem } from '@savantly/sprout-api';
import { EntityPage } from '@sprout-platform/ui';
import { FMPage } from 'plugin/components/FMPage';
import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppModuleRootState, AppModuleState } from '../../../types';
import {
  VendorType as EntityClass,
  vendorTypeService as service,
  vendorTypeStateProvider,
  vendorTypeStateProvider as stateProvider,
} from './entity';
import { VendorTypeEditor } from './VendorTypeEditor';

const vendorTypeColumns = [
  {
    dataField: 'name',
    text: 'Vendor Type',
    sort: true,
  },
];

class VendorTypeIndexPage extends EntityPage<EntityClass> {}

const IndexPage: FC<any> = ({}: AppModuleState) => {
  const state = useSelector((state: AppModuleRootState) => state.franchiseManagerState.vendorTypeState);
  const dispatch = useDispatch();

  useMemo(() => {
    if (!state.isFetched && !state.isFetching) {
      dispatch(vendorTypeStateProvider.loadState());
    }
  }, [state, dispatch]);

  const navModelItem: NavModelItem = {
    text: 'Vendor Type',
    subTitle: 'Add, edit, and delete Vendor Type',
    url: './',
    icon: 'industry',
  };

  const navModel: NavModel = {
    main: navModelItem,
    node: navModelItem,
  };

  return (
    <FMPage model={navModel}>
      <VendorTypeIndexPage
        afterDelete={() => {
          dispatch(stateProvider.loadState());
        }}
        columndescriptions={vendorTypeColumns}
        entityEditor={({ entity, save, cancel }) => (
          <VendorTypeEditor
            entity={entity}
            onCancel={cancel}
            onSubmit={(values, helpers) => {
              save(values).then(response => {
                dispatch(stateProvider.loadState());
              });
            }}
          />
        )}
        entityKeyField="itemId"
        entityService={service}
        entityState={state}
        onDeleteError={() => {}}
      />
    </FMPage>
  );
};

export default IndexPage;
