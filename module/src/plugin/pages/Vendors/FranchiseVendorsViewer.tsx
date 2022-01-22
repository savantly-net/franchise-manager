import React, { Fragment } from 'react';
import { FranchiseVendor } from './entity';

const FranchiseVendorsViewer = ({ item }: { item: FranchiseVendor }) => {
  return (
    <Fragment>
      <div>Name: {item.name}</div>
      <div>Phone Number: {item.phoneNumber}</div>
      <div>Email Address: {item.emailAddress}</div>
      <div>Mailing Address: {item.mailingAddress}</div>
      <div>Notes: {item.notes}</div>
      <div>Type: {item.typeId}</div>
    </Fragment>
  );
};

export default FranchiseVendorsViewer;
