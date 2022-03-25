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
  const qaascoredemo = [
    {
      submissionId: "f23fdfdb-8bf8-4b62-999d-1aa4f549453d",
      overallAvailable: 47,
      overallNA: 2,
      overallRequired: 1,
      overallScore: 21,
      overallRating: 1,
      sections: [
        {
          sectionId: "305ebc10-8168-495a-a85c-6c4476e1f000",
          sectionName: "New QAI Section",
          order: 1,
          categoryScores: [
            {
              categoryName: "New Question Category",
              sectionOrder: 1,
              available: 47,
              na: 2,
              required: 1,
              score: 21,
              rating: 1
            }
          ]
        }
      ],
      scoresByTag: [
        {
          tag: "ok",
          available: 47,
          na: 2,
          required: 1,
          score: 21,
          rating: 1
        }
      ]
    }
  ]
  useMemo(() => {
    if (!internalState && !fetching && submId) {
      isFetching(true);
      QAASubmScoreService.getQAAScore(submId)
        .then(response => {
          isFetching(false);
          // setInternalState(response.data);
          setInternalState(qaascoredemo);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [fetching, internalState, submId]);

  return internalState;
};
