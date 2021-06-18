import { EntityManager, EntityPageName } from '@sprout-platform/ui';
import { AppModuleRootState } from 'plugin/types';
import React from 'react';
import { ColumnDescription } from 'react-bootstrap-table-next';
import {
  AddressBookEntry as EntityClass,
  addressBookService as service,
  addressBookStateProvider as stateProvider,
} from './entity';
import { AddressBookEntryEditor as Editor } from './item/editor';
import { AddressBookEntryViewer as Viewer } from './item/viewer';

const stateSelector = (state: AppModuleRootState) => state.franchiseManagerState.addresses;

const columns: Array<ColumnDescription<EntityClass>> = [
  {
    dataField: 'attributes.name',
    text: 'Name',
    sort: true,
  },
  {
    dataField: 'attributes.phoneNumber',
    text: 'Phone Number',
    sort: true,
  },
  {
    dataField: 'attributes.address',
    text: 'Address',
    sort: true,
  },
];

const IndexPage = () => {
  return (
    <EntityManager
      entityEditor={Editor}
      entityListColumns={columns}
      entityService={service}
      entityStateProvider={stateProvider}
      entityStateSelector={stateSelector}
      entityViewer={Viewer}
      iconProvider={({ item, pageName }: { item?: EntityClass; pageName: EntityPageName }) => {
        return 'address-book';
      }}
      subTitleProvider={({ item, pageName }: { item?: EntityClass; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'Create a new entry in the shared address book';
          case 'edit':
            return '';
          case 'list':
            return 'Manage the address book entries';
          case 'view':
            return '';
          default:
            return '';
        }
      }}
      titleProvider={({ item, pageName }: { item?: EntityClass; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'Create an Address Book Entry';
          case 'edit':
            return `Editing the event: ${item?.attributes?.name}`;
          case 'list':
            return 'All Address Book Entries';
          case 'view':
            return item?.attributes?.name || '';
          default:
            return '';
        }
      }}
    />
  );
};

export default IndexPage;
