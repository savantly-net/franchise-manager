import { EntityManager, EntityPageName } from '@sprout-platform/ui';
import { AppModuleRootState } from 'plugin/types';
import React from 'react';
import { ColumnDescription } from 'react-bootstrap-table-next';
import { Calendar as EntityClass, calendarService as service, calendarStateProvider as stateProvider } from './entity';
import { CalendarItemEditor as Editor } from './item/editor';
import { CalendarItemViewer as Viewer } from './item/viewer';

const stateSelector = (state: AppModuleRootState) => state.franchiseManagerState.calendar;

const columns: Array<ColumnDescription<EntityClass>> = [
  {
    dataField: 'title',
    text: 'Title',
    sort: true,
  },
  {
    dataField: 'tags',
    text: 'Tags',
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
        return 'calendar-alt';
      }}
      subTitleProvider={({ item, pageName }: { item?: EntityClass; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'Create a new event for the shared calendar';
          case 'edit':
            return '';
          case 'list':
            return 'Manage the calendar events';
          case 'view':
            return '';
          default:
            return '';
        }
      }}
      titleProvider={({ item, pageName }: { item?: EntityClass; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'Create an Event';
          case 'edit':
            return `Editing the event: ${item?.title}`;
          case 'list':
            return 'All Calendar Events';
          case 'view':
            return item?.title || '';
          default:
            return '';
        }
      }}
    />
  );
};

export default IndexPage;
