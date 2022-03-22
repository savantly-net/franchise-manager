import { NavModel, NavModelItem } from '@savantly/sprout-api';
import { FMPage } from 'plugin/component/FMPage';
import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import QAAScore from './QAAScorePage';

const navModelItem: NavModelItem = {
  text: 'Quality Assurance Audit Score',
  url: '',
  icon: 'clipboard-list',
  children: [
    {
      text: 'Score',
      url: '',
      icon: 'clipboard-list',
    },
  ],
};

const navModel: NavModel = {
  main: navModelItem,
  node: navModelItem,
};
const IndexPage = () => {
  return (
    <FMPage model={navModel}>
      <Routes>
        <Route path="" element={<QAAScore />} />
      </Routes>
      <Outlet />
    </FMPage>
  );
};

export default IndexPage;
