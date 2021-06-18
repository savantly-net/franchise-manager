import React, { FC } from 'react';
import { connect } from 'react-redux';
import { useInRouterContext } from 'react-router-dom';
import { AppModuleRootState, AppModuleState } from '../../types';

const CreateFormPage: FC<any> = ({}: AppModuleState) => {
  const inRouterContext = useInRouterContext();
  console.log(`CreateForm in router context: ${inRouterContext}`);

  return (
    <div>
      <h3>Franchise Management</h3>
    </div>
  );
};

const mapStateToProps = (state: AppModuleRootState) => {
  return {};
};

export default connect(mapStateToProps)(CreateFormPage);
