import { useMemo, useState } from 'react';
import { FranchiseFeeType, franchiseFeeTypeService } from './feeTypesEntity';

export const useFranchisFeeTypes = (): FranchiseFeeType[] | undefined => {
  const [fetching, isFetching] = useState('' as any);
  const [internalState, setInternalState] = useState(undefined as FranchiseFeeType[] | undefined);

  useMemo(() => {
    if (!internalState && !fetching) {
      isFetching(true);
      franchiseFeeTypeService
        .getAll()
        .then(response => {
          isFetching(false);
          setInternalState(response.data.content);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [fetching, internalState]);

  return internalState;
};
