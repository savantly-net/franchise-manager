import { EntityPage, Form, FormField } from '@sprout-platform/ui';
import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppModuleRootState, AppModuleState } from '../../../types';
import {
  FranchiseMarket,
  franchiseMarketColumns,
  franchiseMarketService,
  franchiseMarketStateProvider,
} from './entity';

class FranchiseMarketEntityPage extends EntityPage<FranchiseMarket> {}

const FranchiseMarketsPage: FC<any> = ({}: AppModuleState) => {
  const state = useSelector((state: AppModuleRootState) => state.franchiseManagerState.marketState);
  const dispatch = useDispatch();

  useMemo(() => {
    if (!state.isFetched && !state.isFetching) {
      dispatch(franchiseMarketStateProvider.loadState());
    }
  }, [state, dispatch]);

  return (
    <div>
      <FranchiseMarketEntityPage
        afterDelete={() => {
          dispatch(franchiseMarketStateProvider.loadState());
        }}
        columndescriptions={franchiseMarketColumns}
        entityEditor={({ entity, save, cancel }) => (
          <Form
            initialValues={entity}
            onSubmit={values => {
              save(values).then(response => {
                dispatch(franchiseMarketStateProvider.loadState());
              });
            }}
            onCancel={cancel}
          >
            {({ values }) => (
              <>
                <FormField name="name" label="Name" />
              </>
            )}
          </Form>
        )}
        entityKeyField="itemId"
        entityService={franchiseMarketService}
        entityState={state}
        onDeleteError={() => {}}
        title="Designated Market Areas"
        subTitle="Add, edit, and delete DMAs"
      />
    </div>
  );
};

export default FranchiseMarketsPage;
