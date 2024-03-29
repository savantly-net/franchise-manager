import { NavModel, NavModelItem } from '@savantly/sprout-api';
import { FMPage } from 'plugin/component/FMPage';
import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import QASubmissionCreate from './item/QASubmissionCreate';
import QAISubmissionEditPage from './item/QASubmissionEditPage';
import QAISubmissionViewPage from './item/QASubmissionViewPage';
import QAAScorePage from './QAScorePage';
import SubmissionListPage from './QASubmissionList';

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
        <Route path="/new" element={<QASubmissionCreate />} />
        <Route path="/list" element={<SubmissionListPage />} />
        <Route path="/item/:itemId" element={<QAISubmissionViewPage />} />
        <Route path="/item/:itemId/edit" element={<QAISubmissionEditPage />} />
        <Route path="/:itemId/score" element={<QAAScorePage />} />
      </Routes>
      <Outlet />
    </FMPage>
  );
};

export default IndexPage;
