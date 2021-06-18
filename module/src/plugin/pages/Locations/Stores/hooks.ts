import { AppModuleRootState } from 'plugin/types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FranchiseFee } from '../Fees/feeEntity';
import { locationService } from '../locationService';
import { loadLocations } from '../state/actions';
import { FranchiseLocation, FranchiseLocationMember } from '../types';

type InternalStateType = FranchiseLocation | undefined;

export const useFMLocation = (locationId?: string): FranchiseLocation | undefined => {
  const [fetching, isFetching] = useState('' as any);
  const [internalState, setInternalState] = useState(undefined as InternalStateType);

  useMemo(() => {
    if (!internalState && !fetching && locationId) {
      isFetching(true);
      locationService
        .getLocationByItemId(locationId)
        .then(response => {
          isFetching(false);
          setInternalState(response.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [fetching, internalState, locationId]);

  return internalState;
};

export const useFMLocations = (): FranchiseLocation[] => {
  const dispatch = useDispatch();
  const locationState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.franchiseLocationState);

  const [internalState, setInternalState] = useState([] as FranchiseLocation[]);

  useMemo(() => {
    if (!locationState.isFetched && !locationState.isFetching) {
      dispatch(loadLocations());
    } else if (locationState.isFetched && !locationState.isFetching) {
      setInternalState(locationState.locations || []);
    }
  }, [locationState, dispatch]);

  return internalState;
};

export const useFMLocationMembers = (locationId?: string): FranchiseLocationMember[] | undefined => {
  const [fetching, isFetching] = useState('' as any);
  const [internalState, setInternalState] = useState(undefined as FranchiseLocationMember[] | undefined);

  useMemo(() => {
    if (!internalState && !fetching && locationId) {
      isFetching(true);
      locationService
        .getLocationMembers(locationId)
        .then(response => {
          isFetching(false);
          setInternalState(response.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [fetching, internalState, locationId]);

  return internalState;
};

export const useFMLocationFees = (locationId?: string): FranchiseFee[] | undefined => {
  const [fetching, isFetching] = useState('' as any);
  const [internalState, setInternalState] = useState(undefined as FranchiseFee[] | undefined);

  useMemo(() => {
    if (!internalState && !fetching && locationId) {
      isFetching(true);
      locationService
        .getLocationFees(locationId)
        .then(response => {
          isFetching(false);
          setInternalState(response.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [fetching, internalState, locationId]);

  return internalState;
};
