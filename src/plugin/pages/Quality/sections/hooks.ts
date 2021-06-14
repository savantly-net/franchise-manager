import { AppModuleRootState } from 'plugin/types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QAISection, qaiSectionService, qaiSectionStateProvider } from './entity';

export const useQAISection = (sectionId?: string): QAISection | undefined => {
  type InternalStateType = QAISection | undefined;

  const [internalState, setInternalState] = useState(undefined as InternalStateType);
  const [fetching, isFetching] = useState('' as any);

  useMemo(() => {
    if (!internalState && !fetching && sectionId) {
      isFetching(true);
      qaiSectionService
        .getById(sectionId)
        .then(response => {
          isFetching(false);
          setInternalState(response.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [fetching, internalState, sectionId]);

  return internalState;
};

export const useQAISections = (): QAISection[] => {
  const dispatch = useDispatch();
  const qaiSectionSelector = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSections);

  const [internalState, setInternalState] = useState([] as QAISection[]);

  useMemo(() => {
    if (!qaiSectionSelector.isFetched && !qaiSectionSelector.isFetching) {
      dispatch(qaiSectionStateProvider.loadState());
    } else if (qaiSectionSelector.isFetched && !qaiSectionSelector.isFetching) {
      const selectedSection = qaiSectionSelector.response || [];
      setInternalState(selectedSection);
    }
  }, [qaiSectionSelector, dispatch]);

  return internalState;
};
