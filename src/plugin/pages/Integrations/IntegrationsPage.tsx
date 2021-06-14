import React, { FC } from 'react';
import { connect } from 'react-redux';
import { useInRouterContext } from 'react-router-dom';
import { AppModuleRootState, AppModuleState } from '../../types';

const IntegrationsPage: FC<any> = ({}: AppModuleState) => {
  const inRouterContext = useInRouterContext();
  console.log(`IntegrationsPage in router context: ${inRouterContext}`);

  return (
    <div>
      <h3>Integrations Management</h3>
      <p>Manage the external integrations</p>
    </div>
  );
};

const mapStateToProps = (state: AppModuleRootState) => {
  return {};
};

export default connect(mapStateToProps)(IntegrationsPage);
