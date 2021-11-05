import React, { Fragment } from 'react';
import { FranchiseGroup } from './entity';

const FranchiseGroupViewer = ({ item }: { item: FranchiseGroup }) => {
  return (
    <Fragment>
      <div>Name: {item.name}</div>
      <div>Address: {item.address1}</div>
      <div>Address2: {item.address2}</div>
      <div>City: {item.city}</div>
      <div>State: {item.state}</div>
      <div>Zip: {item.zip}</div>
    </Fragment>
  );
};

export default FranchiseGroupViewer;
