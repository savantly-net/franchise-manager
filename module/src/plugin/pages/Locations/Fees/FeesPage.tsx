import { EntityPage } from '@sprout-platform/ui';
import { LoadingIcon } from 'plugin/component/LoadingIcon';
import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppModuleRootState, AppModuleState } from '../../../types';
import { loadLocations } from '../state/actions';
import { franchiseFeesStateProvider } from './feeEntity';
import {
  FranchiseFeeType,
  franchiseFeeTypeColumns,
  franchiseFeeTypeService,
  franchiseFeeTypesStateProvider,
} from './feeTypesEntity';
import { FranchiseFeeTypeEditor } from './FranchiseFeeTypeEditor';

class FranchiseFeeTypeEntityPage extends EntityPage<FranchiseFeeType> {}

const FranchiseFeePage: FC<any> = ({}: AppModuleState) => {
  const feeTypeState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.feeTypeState);
  const feeState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.feeState);
  const locationState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.franchiseLocationState);

  const dispatch = useDispatch();

  useMemo(() => {
    if (!feeTypeState.isFetched && !feeTypeState.isFetching) {
      dispatch(franchiseFeeTypesStateProvider.loadState());
    }
  }, [feeTypeState, dispatch]);

  useMemo(() => {
    if (!feeState.isFetched && !feeState.isFetching) {
      dispatch(franchiseFeesStateProvider.loadState());
    }
  }, [feeState, dispatch]);

  useMemo(() => {
    if (!locationState.isFetched && !locationState.isFetching) {
      dispatch(loadLocations());
    }
  }, [locationState, dispatch]);

  return (
    <div>
      {feeTypeState.isFetching && <LoadingIcon />}
      <FranchiseFeeTypeEntityPage
        afterDelete={() => {
          dispatch(franchiseFeeTypesStateProvider.loadState());
        }}
        columndescriptions={franchiseFeeTypeColumns}
        entityEditor={({ entity, save, cancel }) => (
          <FranchiseFeeTypeEditor
            entity={entity}
            onCancel={cancel}
            onSubmit={(values, helpers) => {
              save(values).then(response => {
                dispatch(franchiseFeeTypesStateProvider.loadState());
              });
            }}
          />
        )}
        entityKeyField="itemId"
        entityService={franchiseFeeTypeService}
        entityState={feeTypeState}
        onDeleteError={() => {}}
        title="Franchise Fee Types"
        subTitle="Add, edit, and delete Franchise Fee types."
      />
    </div>
  );
};

export default FranchiseFeePage;
