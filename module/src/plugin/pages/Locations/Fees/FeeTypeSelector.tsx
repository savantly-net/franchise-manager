import { AppModuleRootState } from 'plugin/types';
import React, { Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { franchiseFeeTypesStateProvider } from './feeTypesEntity';

export const FeeTypeSelector = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const feeTypeState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.feeTypeState);
  const dispatch = useDispatch();
  useMemo(() => {
    if (!feeTypeState.isFetched && !feeTypeState.isFetching) {
      dispatch(franchiseFeeTypesStateProvider.loadState());
    }
  }, [feeTypeState, dispatch]);
  return (
    <Fragment>
      <select className="form-control" value={value} onChange={e => onChange(e.target.value)}>
        <option></option>
        <Fragment>
          {feeTypeState.response &&
            feeTypeState.response.content &&
            feeTypeState.response.content.map((t, index) => (
              <option key={index} value={t.itemId}>
                {t.name}
              </option>
            ))}
        </Fragment>
      </select>
    </Fragment>
  );
};
