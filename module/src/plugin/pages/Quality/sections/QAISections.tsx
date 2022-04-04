import { ColumnDescription, EntityManager, EntityPageName } from '@sprout-platform/ui';
import { AppModuleRootState } from 'plugin/types';
import React from 'react';
import {
  qaSectionService as service,
  QASection as EntityClass,
  qaSectionStateProvider as stateProvider,
} from './entity';
import { useQASections } from './hooks';
import { QASectionEditor as Editor } from './item/editor';
import { QASectionViewer as Viewer } from './item/viewer';

const stateSelector = (state: AppModuleRootState) => state.franchiseManagerState.qaSections;

const IndexPage = () => {
  const qaiSections = useQASections();
  const getSection = (sectionId?: string) => {
    if (qaiSections && sectionId) {
      const found = qaiSections.filter(s => s.itemId === sectionId);
      if (found) {
        return found[0];
      }
    }
    return undefined;
  };
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
        const section = getSection(row.itemId);
        return <span>{section?.guestQuestions ? section?.guestQuestions.length + section?.questions.length : ''}</span>;
      },
    },
  ];
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
            return 'Create a new QA Section';
          case 'edit':
            return '';
          case 'list':
            return 'Manage the QA Sections';
          case 'view':
            return '';
          default:
            return '';
        }
      }}
      titleProvider={({ item, pageName }: { item?: EntityClass; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'New QA Section';
          case 'edit':
            return `Editing the QA Section: ${item?.name}`;
          case 'list':
            return 'All QA Section';
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
