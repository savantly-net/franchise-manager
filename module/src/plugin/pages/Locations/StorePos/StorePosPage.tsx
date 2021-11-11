import { EntityManager, EntityPageName } from '@sprout-platform/ui';
import { AppModuleRootState, AppModuleState } from 'plugin/types';
import React, { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { StorePos, storePosColumns, storePosService, storePosStateProvider } from './entity';
import { StorePosEditor } from './StorePosEditor';
import StorePosViewer from './StorePosViewer';

const StorePosPage: FC<any> = ({}: AppModuleState) => {
  const dispatch = useDispatch();

  useMemo(() => {
    dispatch(storePosStateProvider.loadState());
  }, [dispatch]);

  return (
    <div>
      <EntityManager
        entityEditor={StorePosEditor}
        entityListColumns={storePosColumns}
        entityService={storePosService}
        entityStateProvider={storePosStateProvider}
        entityStateSelector={(state: AppModuleRootState) => state.franchiseManagerState.storePosState}
        entityViewer={StorePosViewer}
        iconProvider={({ item, pageName }: { item?: StorePos; pageName: EntityPageName }) => {
          return 'Franchise Group';
        }}
        subTitleProvider={({ item, pageName }: { item?: StorePos; pageName: EntityPageName }) => {
          switch (pageName) {
            case 'create':
              return 'A "Store" is a virtual concept that\'s associated with a POS [a licensed terminal]';
            case 'edit':
              return '';
            case 'list':
              return 'Manage the Store to POS relationships';
            case 'view':
              return '';
            default:
              return '';
          }
        }}
        titleProvider={({ item, pageName }: { item?: StorePos; pageName: EntityPageName }) => {
          switch (pageName) {
            case 'create':
              return 'Create a Store to POS relationship';
            case 'edit':
              return `Editing the Store: ${item?.storeId}`;
            case 'list':
              return 'All Store to POS relationships';
            case 'view':
              return item?.storeId || '';
            default:
              return '';
          }
        }}
      />
    </div>
  );
};

export default StorePosPage;
