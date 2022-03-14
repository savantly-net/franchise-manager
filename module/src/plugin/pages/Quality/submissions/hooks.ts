import { AppModuleRootState } from 'plugin/types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QAISectionSubmission, qaiSubmissionStateProvider } from './entity';

export const useQAISectionSubmission = (submissionId?: String): QAISectionSubmission | any => {
  type InternalStateType = any | undefined;
  const dispatch = useDispatch();
  const qaiSelector = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSubmissions);
  const [internalState, setInternalState] = useState(undefined as InternalStateType);

  useMemo(() => {
    if (!qaiSelector.isFetched && !qaiSelector.isFetching) {
      dispatch(qaiSubmissionStateProvider.loadState());
    } else if (qaiSelector.isFetched && !qaiSelector.isFetching) {
      const found = qaiSelector.response?.content.filter(s => s.id === submissionId);
      // const found = qaiSelector.response?.content.filter(s => s.itemId === submissionId);
      if (found && found.length > 0) {
        setInternalState(found[0]);
      }
    }
  }, [qaiSelector, dispatch, submissionId]);

  return internalState;
};
