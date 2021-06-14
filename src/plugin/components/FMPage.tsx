import { NavModelItem } from '@savantly/sprout-api';
import { PageHeader } from '@sprout-platform/ui';
import React, { FC, ReactElement } from 'react';
import { Outlet } from 'react-router-dom';

export interface PageModel {
  main: NavModelItem;
}

export interface FMPageProps {
  model: PageModel;
  children: ReactElement;
}

export const FMPage: FC<any> = ({ model, children }: FMPageProps) => {
  return (
    <div className="page-scrollbar-content">
      <PageHeader
        model={{
          main: model.main,
          node: model.main,
        }}
      />
      <div className="page-container page-body">
        {children}
        <Outlet />
      </div>
      <footer className="footer"></footer>
    </div>
  );
};
