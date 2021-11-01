import React, { Fragment } from 'react';
import { FranchiseOwnership } from './entity';

const FranchiseOwnershipViewer = ({ item }: { item: FranchiseOwnership }) => {
  return (
    <Fragment>
      <div>Incorporated Name: {item.incorporatedName}</div>
      <div>Group: {item.groupId}</div>
      <div>Location: {item.locationId}</div>
      <div>Store: {item.storeId}</div>
      <div>Start Date: {item.startDate}</div>
      <div>End Date: {item.endDate}</div>
    </Fragment>
  );
};

export default FranchiseOwnershipViewer;
