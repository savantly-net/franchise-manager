import { useMemo, useState } from 'react';
import { qaService, QASubmission, QASubmissionScore } from './entity';

export const useQASubmission = (submissionId?: string): QASubmission | undefined => {
  const [fetching, isFetching] = useState(false);
  type InternalStateType = QASubmission | undefined;
  const [internalState, setInternalState] = useState(undefined as InternalStateType);

  useMemo(() => {
    if (!internalState && !fetching && submissionId) {
      isFetching(true);
      qaService
        .getById(submissionId)
        .then(response => {
          isFetching(false);
          setInternalState(response.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [fetching, internalState, submissionId]);

  return internalState;
};

export const useQAASubmissionScore = (submId?: string): QASubmissionScore | undefined => {
  const [fetching, isFetching] = useState(false);
  const [internalState, setInternalState] = useState(undefined as QASubmissionScore | undefined);
  useMemo(() => {
    if (!internalState && !fetching && submId) {
      isFetching(true);
      qaService
        .getQAScore(submId)
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
