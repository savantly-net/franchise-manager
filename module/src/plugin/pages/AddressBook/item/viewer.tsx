import React, { Fragment } from 'react';
import { AddressBookEntry as EntityClass } from '../entity';

export const AddressBookEntryViewer = ({ item }: { item: EntityClass }) => {
  return (
    <Fragment>
      <h2>{item.attributes?.name}</h2>
      <hr />
      <div className="mb-2">
        <h5>Details</h5>
        <div>
          <label className="mr-2">Name: </label>
          <span>{item.attributes?.name}</span>
        </div>
        <div>
          <label className="mr-2">Phone: </label>
          <span>{item.attributes?.phoneNumber}</span>
        </div>
        <div>
          <label className="mr-2">Address: </label>
          <span>{item.attributes?.address}</span>
        </div>
      </div>
    </Fragment>
  );
};
