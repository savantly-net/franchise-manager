import { EntityManager, EntityPageName } from '@sprout-platform/ui';
import React from 'react';
import { ColumnDescription } from 'react-bootstrap-table-next';
import { Newsletter, newsletterService, newsletterStateProvider } from './entityConfig';
import { NewsletterItemEditor } from './item/NewsletterEditor';
import NewsletterViewer from './item/NewsletterViewer';

const columns: Array<ColumnDescription<Newsletter>> = [
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

const NewsletterIndexPage = () => {
  return (
    <EntityManager
      entityEditor={NewsletterItemEditor}
      entityListColumns={columns}
      entityService={newsletterService}
      entityStateProvider={newsletterStateProvider}
      entityStateSelector={state => state.franchiseManagerState.newsletter}
      entityViewer={NewsletterViewer}
      iconProvider={({ item, pageName }: { item?: Newsletter; pageName: EntityPageName }) => {
        return 'newspaper';
      }}
      subTitleProvider={({ item, pageName }: { item?: Newsletter; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'Items created will appear in the Newsletter Feed';
          case 'edit':
            return '';
          case 'list':
            return 'Manage the Newsletter items';
          case 'view':
            return '';
          default:
            return '';
        }
      }}
      titleProvider={({ item, pageName }: { item?: Newsletter; pageName: EntityPageName }) => {
        switch (pageName) {
          case 'create':
            return 'Create a Newsletter';
          case 'edit':
            return `Editing the Newsletter: ${item?.title}`;
          case 'list':
            return 'All Newsletters';
          case 'view':
            return item?.title || '';
          default:
            return '';
        }
      }}
    />
  );
};

export default NewsletterIndexPage;
