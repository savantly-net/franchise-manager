import { AppModuleRootState } from 'plugin/types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FranchiseGroup, franchiseGroupsStateProvider } from './entity';

export const useFMGroups = (): FranchiseGroup[] | undefined => {
  const dispatch = useDispatch();
  const groupState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.groupState);

  const [internalState, setInternalState] = useState((undefined as any) as FranchiseGroup[] | undefined);

  useMemo(() => {
    if (!groupState.isFetched && !groupState.isFetching) {
      dispatch(franchiseGroupsStateProvider.loadState());
    } else if (groupState.isFetched && !groupState.isFetching) {
      setInternalState(groupState.response?.content || []);
    }
  }, [groupState, dispatch]);

  return internalState;
};
