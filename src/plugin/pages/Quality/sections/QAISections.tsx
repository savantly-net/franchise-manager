import { ColumnDescription, EntityManager, EntityPageName } from '@sprout-platform/ui';
import { AppModuleRootState } from 'plugin/types';
import React from 'react';
import {
  QAISection as EntityClass,
  qaiSectionService as service,
  qaiSectionStateProvider as stateProvider,
} from './entity';
import { QAISectionEditor as Editor } from './item/editor';
import { QAISectionViewer as Viewer } from './item/viewer';

const stateSelector = (state: AppModuleRootState) => state.franchiseManagerState.qaiSections;

const columns: Array<ColumnDescription<EntityClass>> = [
  {
    dataField: 'name',
    text: 'Name',
    sort: true,
  },
  {
    isDummyField: true,
    dataField: 'questionCount',
    text: 'Questions',
    formatter: (cell, row) => {
      return row.guestQuestions.length + row.questions.length;
    },
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
        return 'clipboard-check';
      }}
      subTitleProvider={({ item, pageName }: { item?: EntityClass; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'Create a new QAI Section';
          case 'edit':
            return '';
          case 'list':
            return 'Manage the QAI Sections';
          case 'view':
            return '';
          default:
            return '';
        }
      }}
      titleProvider={({ item, pageName }: { item?: EntityClass; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'New QAI Section';
          case 'edit':
            return `Editing the QAI Section: ${item?.name}`;
          case 'list':
            return 'All QAI Section';
          case 'view':
            return item?.name || '';
          default:
            return '';
        }
      }}
    />
  );
};

export default IndexPage;
