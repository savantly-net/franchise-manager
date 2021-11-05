import React, { Fragment } from 'react';
import { StorePos } from './entity';

const StorePosViewer = ({ item }: { item: StorePos }) => {
  return (
    <Fragment>
      <div>Store ID: {item.storeId}</div>
      <div>POS ID: {item.posId}</div>
      <div>Start Date: {item.startDate}</div>
      <div>End Date: {item.endDate}</div>
    </Fragment>
  );
};

export default StorePosViewer;
