import { NavModel, NavModelItem } from '@savantly/sprout-api';
import { EntityPage } from '@sprout-platform/ui';
import { FMPage } from 'plugin/component/FMPage';
import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppModuleRootState, AppModuleState } from '../../../types';
import {
  QAQuestionCategory as EntityClass,
  qaQuestionCategoryService as service,
  qaQuestionCategoryStateProvider,
  qaQuestionCategoryStateProvider as stateProvider,
} from './entity';
import { QAQuestionCategoryEditor } from './QAQuestionCategoryEditor';

const qaQuestionCategoryColumns = [
  {
    dataField: 'name',
    text: 'Name',
    sort: true,
  },
];

class QACategoriesIndexPage extends EntityPage<EntityClass> {}

const IndexPage: FC<any> = ({}: AppModuleState) => {
  const state = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaQuestionCategories);
  const dispatch = useDispatch();

  useMemo(() => {
    if (!state.isFetched && !state.isFetching) {
      dispatch(qaQuestionCategoryStateProvider.loadState());
    }
  }, [state, dispatch]);

  const navModelItem: NavModelItem = {
    text: 'QA Question Categories',
    subTitle: 'Add, edit, and delete QAI Question Categories',
    url: './',
    icon: 'clone',
  };

  const navModel: NavModel = {
    main: navModelItem,
    node: navModelItem,
  };

  return (
    <FMPage model={navModel}>
      <QACategoriesIndexPage
        afterDelete={() => {
          dispatch(stateProvider.loadState());
        }}
        columndescriptions={qaQuestionCategoryColumns}
        entityEditor={({ entity, save, cancel }) => (
          <QAQuestionCategoryEditor
            entity={entity}
            onCancel={cancel}
            onSubmit={(values, helpers) => {
              save(values).then(response => {
                dispatch(stateProvider.loadState());
              });
            }}
          />
        )}
        entityKeyField="itemId"
        entityService={service}
        entityState={state}
        onDeleteError={() => {}}
      />
    </FMPage>
  );
};

export default IndexPage;
