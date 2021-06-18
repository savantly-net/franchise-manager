import { AppPluginMeta, NavModelItem } from '@savantly/sprout-api';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Route, Routes } from 'react-router-dom';
import { loadOptions } from './config/fmOptions';
import AddressBookPage from './pages/AddressBook/AddressBookIndexPage';
import CalendarPage from './pages/Calendar/CalendarIndexPage';
import InfoPage from './pages/info/InfoPage';
import IntegrationsPage from './pages/Integrations/IntegrationsPage';
import KnowledgeIndexPage from './pages/Knowledge/KnowledgeIndexPage';
import GroupsPage from './pages/Locations/Groups/GroupsPage';
import LocationsIndexPage from './pages/Locations/LocationsIndexPage';
import NewsletterIndexPage from './pages/Newsletter/NewsletterIndexPage';
import QAIIndexPage from './pages/Quality/QAIIndexPage';
import QAISubmissionsIndexPage from './pages/Quality/submissions/QAISubmissionsIndexPage';
import StoreVisitIndexPage from './pages/Quality/visits/StoreVisitIndexPage';
import ReportManagerIndexPage from './pages/ReportManager/ReportManagerIndexPage';
import ReportsIndexPage from './pages/Reports/ReportsIndexPage';
import { AppModuleRootState, AppPluginSettings } from './types';

interface Props {
  path: string;
  onNavChanged: ({ node, main }: { node: NavModelItem; main: NavModelItem }) => void;
  meta: AppPluginMeta<AppPluginSettings>;
}

export const SubPageContainer = ({ path, onNavChanged, meta }: Props) => {
  const dispatch = useDispatch();
  const fmSelectOptions = useSelector((state: AppModuleRootState) => state.franchiseManagerState.fmSelectOptions);

  useMemo(() => {
    if (!fmSelectOptions.isFetched && !fmSelectOptions.isFetching) {
      dispatch(loadOptions());
    }
  }, [fmSelectOptions, dispatch]);
  return (
    <div>
      <Routes>
        <Route path="/" element={<InfoPage />} />
        <Route path="/addresses/*" element={<AddressBookPage />} />
        <Route path="/calendar/*" element={<CalendarPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/knowledge/*" element={<KnowledgeIndexPage />} />
        <Route path="/locations/*" element={<LocationsIndexPage onNavChanged={onNavChanged} />} />
        <Route path="/groups/*" element={<GroupsPage />} />
        <Route path="/newsletter/*" element={<NewsletterIndexPage />} />
        <Route path="/qai/manage/*" element={<QAIIndexPage />} />
        <Route path="/qai/submissions/*" element={<QAISubmissionsIndexPage />} />
        <Route path="/store-visits/*" element={<StoreVisitIndexPage />} />
        <Route path="/reports/:id" element={<ReportsIndexPage />} />
        <Route path="/report-manager/*" element={<ReportManagerIndexPage />} />
      </Routes>
      <Outlet />
    </div>
  );
};
