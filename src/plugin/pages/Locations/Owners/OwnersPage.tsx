import React, { FC } from 'react';
import { connect } from 'react-redux';
import { useInRouterContext } from 'react-router-dom';
import { AppModuleRootState, AppModuleState } from '../../../types';

const OwnersPage: FC<any> = ({}: AppModuleState) => {
  const inRouterContext = useInRouterContext();
  console.log(`CreateForm in router context: ${inRouterContext}`);

  return (
    <div>
      <h3>Franchise Owners Management</h3>
      <p>Manage Franchise Owners</p>
    </div>
  );
};

const mapStateToProps = (state: AppModuleRootState) => {
  return {};
};

export default connect(mapStateToProps)(OwnersPage);
