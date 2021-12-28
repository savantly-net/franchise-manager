import React from 'react';
import { NavModel, NavModelItem } from '@savantly/sprout-api';
import { FMPage } from 'plugin/components/FMPage';
import { StoreVisit as EntityClass } from './entity';
import '../../storevisittabs.css';
const IndexPage = ({ item, isVisit, isTitle }: { item: EntityClass; isVisit: any; isTitle: any }) => {
  const navModelItem: NavModelItem = {
    text: isTitle,
    url: ``,
    icon: isVisit ? 'clipboard-check' : 'clipboard-list',
    children: [
      {
        text: 'Visit',
        url: isVisit ? `../${item.itemId}` : `../../../item/${item.itemId}`,
        icon: 'clipboard-list',
        active: isVisit ? true : false,
      },
      {
        text: 'QA Details',
        url: isVisit
          ? `../../qui/${item.itemId}/${item.sectionSubmissionId}`
          : `../../../qui/${item.itemId}/${item.sectionSubmissionId}`,
        icon: 'plus',
        active: isVisit ? false : true,
      },
    ],
  };
  const navModel: NavModel = {
    main: navModelItem,
    node: navModelItem,
  };
  return (
    <div className="storeVisitTabs">
      <FMPage model={navModel}></FMPage>
    </div>
  );
};

export default IndexPage;
