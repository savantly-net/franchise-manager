import { NavModel, NavModelItem } from '@savantly/sprout-api';
import { FMPage } from 'plugin/components/FMPage';
import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import FeesPage from './Fees/FeesPage';
import MarketsPage from './Markets/MarketsPage';
import OwnersPage from './Owners/OwnersPage';
import LocationsListPage from './Stores/LocationsListPage';

const LocationsIndexPage: FC<any> = () => {
  const navModelItem: NavModelItem = {
    text: 'Franchise Locations',
    url: './',
    icon: 'store',
    children: [
      {
        text: 'Locations',
        url: './stores',
        icon: 'store',
      },
      {
        text: 'Fees Types',
        url: './fees',
        icon: 'file-invoice-dollar',
      },
      {
        text: 'Markets',
        url: './markets',
        icon: 'map-marked-alt',
      },
    ],
  };

  const navModel: NavModel = {
    main: navModelItem,
    node: navModelItem,
  };

  return (
    <FMPage model={navModel}>
      <Routes>
        <Route path="/stores/*" element={<LocationsListPage />} />
        <Route path="/fees/*" element={<FeesPage />} />
        <Route path="/markets/*" element={<MarketsPage />} />
        <Route path="/owners/*" element={<OwnersPage />} />
      </Routes>
    </FMPage>
  );
};

export default LocationsIndexPage;
