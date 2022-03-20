import { NavModel, NavModelItem } from '@savantly/sprout-api';
import { FMPage } from 'plugin/component/FMPage';
import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import QAISubmissionCreate from './item/QAISubmissionCreate';
import QAISubmissionEditPage from './item/QAISubmissionEditPage';
import QAISubmissionViewPage from './item/QAISubmissionViewPage';
import SubmissionListPage from './QAISubmissionList';

const navModelItem: NavModelItem = {
  text: 'Quality Assurance Audit Submissions',
  url: './list',
  icon: 'clipboard-list',
  children: [
    {
      text: 'List',
      url: './list',
      icon: 'clipboard-list',
    },
    {
      text: 'New Submission',
      url: './new',
      icon: 'plus',
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
        <Route path="/new" element={<QAISubmissionCreate />} />
        <Route path="/list" element={<SubmissionListPage />} />
        <Route path="/item/:itemId" element={<QAISubmissionViewPage />} />
        <Route path="/item/:itemId/edit" element={<QAISubmissionEditPage />} />
      </Routes>
      <Outlet />
    </FMPage>
  );
};

export default IndexPage;
