import { AppModuleRootState } from 'plugin/types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QAISectionSubmission, qaiSubmissionStateProvider } from './entity';
import { QAASubmScoreService, QAASubmissionScore } from './qaa/entity';

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

export const useQAASubmissionScore = (submId?: string): QAASubmissionScore[] | undefined => {
  const [fetching, isFetching] = useState('' as any);
  const [internalState, setInternalState] = useState(undefined as QAASubmissionScore[] | undefined);
  useMemo(() => {
    if (!internalState && !fetching && submId) {
      isFetching(true);
      QAASubmScoreService.getQAAScore(submId)
        .then(response => {
          isFetching(false);
          setInternalState(response.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [fetching, internalState, submId]);

  return internalState;
};
