import { AppModuleRootState } from 'plugin/types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FranchiseVendor, franchiseVendorStateProvider } from './entity';

export const useFMVendors = (): FranchiseVendor[] | undefined => {
  const dispatch = useDispatch();
  const vendorState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.vendorState);

  const [internalState, setInternalState] = useState((undefined as any) as FranchiseVendor[] | undefined);

  useMemo(() => {
    if (!vendorState.isFetched && !vendorState.isFetching) {
      dispatch(franchiseVendorStateProvider.loadState());
    } else if (vendorState.isFetched && !vendorState.isFetching) {
      setInternalState(vendorState.response?.content || []);
    }
  }, [vendorState, dispatch]);

  return internalState;
};
