import { EntityManager, EntityPageName } from '@sprout-platform/ui';
import { AppModuleRootState } from 'plugin/types';
import React from 'react';
import { ColumnDescription } from 'react-bootstrap-table-next';
import {
  Knowledge as EntityClass,
  knowledgeService as service,
  knowledgesStateProvider as stateProvider,
} from './entity';
import { KnowledgeItemEditor as Editor } from './item/KnowledgeEditor';
import { KnowledgeItemViewer as Viewer } from './item/KnowledgeViewer';

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

const KnowledgeIndexPage = () => {
  return (
    <EntityManager
      entityEditor={Editor}
      entityListColumns={columns}
      entityService={service}
      entityStateProvider={stateProvider}
      entityStateSelector={(state: AppModuleRootState) => state.franchiseManagerState.knowledge}
      entityViewer={Viewer}
      iconProvider={({ item, pageName }: { item?: EntityClass; pageName: EntityPageName }) => {
        return 'graduation-cap';
      }}
      subTitleProvider={({ item, pageName }: { item?: EntityClass; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'Create a new page for the knowledge repository';
          case 'edit':
            return '';
          case 'list':
            return 'Manage the Knowledge repository pages';
          case 'view':
            return '';
          default:
            return '';
        }
      }}
      titleProvider={({ item, pageName }: { item?: EntityClass; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'Create a new Knowledge Page';
          case 'edit':
            return `Editing the Page: ${item?.title}`;
          case 'list':
            return 'All Knowledge Pages';
          case 'view':
            return item?.title || '';
          default:
            return '';
        }
      }}
    />
  );
};

export default KnowledgeIndexPage;
