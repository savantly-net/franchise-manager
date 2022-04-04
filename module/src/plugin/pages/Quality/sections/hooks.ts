import { AppModuleRootState } from 'plugin/types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QASection, qaSectionService, qaSectionStateProvider } from './entity';

export const useQASection = (sectionId?: string): QASection | undefined => {
  type InternalStateType = QASection | undefined;

  const [internalState, setInternalState] = useState(undefined as InternalStateType);
  const [fetching, isFetching] = useState('' as any);

  useMemo(() => {
    if (!internalState && !fetching && sectionId) {
      isFetching(true);
      qaSectionService
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

export const useQASections = (): QASection[] | undefined => {
  const dispatch = useDispatch();
  const qaiSectionSelector = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaSections);

  const [internalState, setInternalState] = useState<QASection[] | undefined>();

  useMemo(() => {
    if (!qaiSectionSelector.isFetched && !qaiSectionSelector.isFetching) {
      dispatch(qaSectionStateProvider.loadState());
    } else if (qaiSectionSelector.isFetched && !qaiSectionSelector.isFetching) {
      const selectedSection = qaiSectionSelector.response || [];
      setInternalState(selectedSection);
    }
  }, [qaiSectionSelector, dispatch]);

  return internalState;
};
