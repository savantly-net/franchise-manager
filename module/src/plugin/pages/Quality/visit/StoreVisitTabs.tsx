import { NavModel, NavModelItem } from '@savantly/sprout-api';
import { FMPage } from 'plugin/component/FMPage';
import React from 'react';
import '../../storevisittabs.css';
import { StoreVisit as EntityClass } from './entity';
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
          ? `../../qai/${item.itemId}/${item.sectionSubmissionId}`
          : `../../../qai/${item.itemId}/${item.sectionSubmissionId}`,
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
