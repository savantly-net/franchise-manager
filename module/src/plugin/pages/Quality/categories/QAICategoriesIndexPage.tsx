import { NavModel, NavModelItem } from '@savantly/sprout-api';
import { EntityPage } from '@sprout-platform/ui';
import { FMPage } from 'plugin/components/FMPage';
import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppModuleRootState, AppModuleState } from '../../../types';
import {
  QAIQuestionCategory as EntityClass,
  qaiQuestionCategoryService as service,
  qaiQuestionCategoryStateProvider,
  qaiQuestionCategoryStateProvider as stateProvider,
} from './entity';
import { QAIQuestionCategoryEditor } from './QAIQuestionCategoryEditor';

const qaiQuestionCategoryColumns = [
  {
    dataField: 'name',
    text: 'Name',
    sort: true,
  },
];

class QAICategoriesIndexPage extends EntityPage<EntityClass> {}

const IndexPage: FC<any> = ({}: AppModuleState) => {
  const state = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiQuestionCategories);
  const dispatch = useDispatch();

  useMemo(() => {
    if (!state.isFetched && !state.isFetching) {
      dispatch(qaiQuestionCategoryStateProvider.loadState());
    }
  }, [state, dispatch]);

  const navModelItem: NavModelItem = {
    text: 'QAI Question Categories',
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
      <QAICategoriesIndexPage
        afterDelete={() => {
          dispatch(stateProvider.loadState());
        }}
        columndescriptions={qaiQuestionCategoryColumns}
        entityEditor={({ entity, save, cancel }) => (
          <QAIQuestionCategoryEditor
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
