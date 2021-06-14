import { EntityManager, EntityPageName } from '@sprout-platform/ui';
import React from 'react';
import { ColumnDescription } from 'react-bootstrap-table-next';
import { ReportSource, reportSourceService, reportSourceStateProvider } from './entityConfig';
import Editor from './item/ReportSourceEditor';
import Viewer from './item/ReportSourceViewer';

const columns: Array<ColumnDescription<ReportSource>> = [
  {
    dataField: 'weight',
    text: 'Menu Weight',
    sort: true,
  },
  {
    dataField: 'menuPath',
    text: 'Menu Path',
    sort: true,
  },
  {
    dataField: 'name',
    text: 'Name',
    sort: true,
  },
  {
    dataField: 'url',
    text: 'URL',
    sort: true,
  },
];

const ReportManagerIndexPage = () => {
  return (
    <EntityManager
      entityEditor={Editor}
      entityListColumns={columns}
      entityService={reportSourceService}
      entityStateProvider={reportSourceStateProvider}
      entityStateSelector={state => state.franchiseManagerState.reportSources}
      entityViewer={Viewer}
      iconProvider={({ item, pageName }: { item?: ReportSource; pageName: EntityPageName }) => {
        return 'chart-area';
      }}
      subTitleProvider={({ item, pageName }: { item?: ReportSource; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'This item will appear in the reports menu';
          case 'edit':
            return '';
          case 'list':
            return 'These items appear in the reports menu';
          case 'view':
            return '';
          default:
            return '';
        }
      }}
      titleProvider={({ item, pageName }: { item?: ReportSource; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'Create a Report Source';
          case 'edit':
            return `Editing the Report Source: ${item?.name}`;
          case 'list':
            return 'All Report Sources';
          case 'view':
            return item?.name || '';
          default:
            return '';
        }
      }}
    />
  );
};

export default ReportManagerIndexPage;
