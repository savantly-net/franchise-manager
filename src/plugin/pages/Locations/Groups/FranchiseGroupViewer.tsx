import React, { Fragment } from 'react';
import { FranchiseGroup } from './entity';

const FranchiseGroupViewer = ({ item }: { item: FranchiseGroup }) => {
  return (
    <Fragment>
      <div>Name: {item.name}</div>
    </Fragment>
  );
};

export default FranchiseGroupViewer;
