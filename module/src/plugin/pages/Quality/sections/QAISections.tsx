import { ColumnDescription, EntityManager, EntityPageName } from '@sprout-platform/ui';
import { AppModuleRootState } from 'plugin/types';
import React from 'react';
import {
  QAISection as EntityClass,
  qaiSectionService as service,
  qaiSectionStateProvider as stateProvider,
} from './entity';
import { useQAISections } from './hooks';
import { QAISectionEditor as Editor } from './item/editor';
import { QAISectionViewer as Viewer } from './item/viewer';

const stateSelector = (state: AppModuleRootState) => state.franchiseManagerState.qaiSections;

const IndexPage = () => {
  const qaiSections = useQAISections();
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
            return 'Create a new QAA Section';
          case 'edit':
            return '';
          case 'list':
            return 'Manage the QAA Sections';
          case 'view':
            return '';
          default:
            return '';
        }
      }}
      titleProvider={({ item, pageName }: { item?: EntityClass; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'New QAA Section';
          case 'edit':
            return `Editing the QAA Section: ${item?.name}`;
          case 'list':
            return 'All QAA Section';
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
