import { getApiService } from '@savantly/sprout-runtime';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import React, { Fragment, useMemo, useState } from 'react';
import { FranchiseVendor } from './entity';

const FranchiseVendorsViewer = ({ item }: { item: FranchiseVendor }) => {
  const [vendorTy, setVendorTy] = useState('');
  useMemo(() => {
    if (item.typeId) {
      getApiService()
        .get(`${API_URL}/vendor-type/`)
        .then(response => {
          const found = response?.data?.content.filter((l: any) => l.itemId === item.typeId)?.[0]?.name;
          setVendorTy(found);
        })
        .catch(err => {
          console.error(err.message || err.detail || 'An error occurred while saving.');
        });
    } else {
      setVendorTy('');
    }
  }, [item, setVendorTy]);
  return (
    <Fragment>
      <div>Name: {item.name}</div>
      <div>Phone Number: {item.phoneNumber}</div>
      <div>Email Address: {item.emailAddress}</div>
      <div>Mailing Address: {item.mailingAddress}</div>
      <div>Notes: {item.notes}</div>
      <div>Type: {vendorTy ? vendorTy : item.typeId}</div>
    </Fragment>
  );
};

export default FranchiseVendorsViewer;
