import { AppRootProps } from '@savantly/sprout-api';
import React from 'react';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import { getFormStateModule } from './state/AppStateModule';
import { SubPageContainer } from './SubPageContainer';
import { AppPluginSettings } from './types';

interface Props extends AppRootProps<AppPluginSettings> {}

export const AppRootPage = ({ path, onNavChanged, meta }: Props) => {
  return (
    <div>
      <DynamicModuleLoader modules={[getFormStateModule()]}>
        <SubPageContainer path={path} onNavChanged={onNavChanged} meta={meta} />
      </DynamicModuleLoader>
    </div>
  );
};
