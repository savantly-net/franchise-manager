import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import QAICategories from './categories/QAICategoriesIndexPage';
import QAISections from './sections/QAISections';

const QAIIndexPage: FC<any> = () => {
  return (
    <Routes>
      <Route path="/sections/*" element={<QAISections />} />
      <Route path="/categories/*" element={<QAICategories />} />
    </Routes>
  );
};

export default QAIIndexPage;
