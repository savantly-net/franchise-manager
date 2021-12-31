import { NavModel, NavModelItem } from '@savantly/sprout-api';
import { FMPage } from 'plugin/component/FMPage';
import { ConfigPageProps } from 'plugin/types';
import React, { Component, FC } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import QAISettingsPage from './QAISettingsPage';

const PluginConfiguration: FC<ConfigPageProps> = props => {
  const navModelItem: NavModelItem = {
    text: 'Franchise Manager Configuration',
    url: './',
    icon: 'cog',
    children: [
      {
        text: 'QAI',
        url: './qai',
        icon: 'clipboard-check',
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
        <Route
          element={
            <div>
              <p>Configure the Franchise Manager</p>
            </div>
          }
        />
        <Route path="/qai" element={<QAISettingsPage {...props} />} />
      </Routes>
      <Outlet />
    </FMPage>
  );
};

class PluginConfigurationPage extends Component<ConfigPageProps> {
  constructor(props: ConfigPageProps) {
    super(props);
  }

  render() {
    return <PluginConfiguration {...this.props} />;
  }
}

export default PluginConfigurationPage;
