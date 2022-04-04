import { AppModuleRootState } from 'plugin/types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  QAQuestionCategory,
  qaQuestionCategoryService as service,
  qaQuestionCategoryStateProvider as stateProvider,
} from './entity';

export const useQAQuestionCategory = (itemId?: string): QAQuestionCategory | undefined => {
  type InternalStateType = QAQuestionCategory | undefined;

  const [internalState, setInternalState] = useState(undefined as InternalStateType);
  const [fetching, isFetching] = useState('' as any);

  useMemo(() => {
    if (!internalState && !fetching && itemId) {
      isFetching(true);
      service
        .getById(itemId)
        .then(response => {
          isFetching(false);
          setInternalState(response.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [fetching, internalState, itemId]);

  return internalState;
};

export const useQAQuestionCategories = (): QAQuestionCategory[] | undefined => {
  const dispatch = useDispatch();
  const stateSelector = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaQuestionCategories);

  const [internalState, setInternalState] = useState<QAQuestionCategory[] | undefined>();

  useMemo(() => {
    if (!stateSelector.isFetched && !stateSelector.isFetching) {
      dispatch(stateProvider.loadState());
    } else if (stateSelector.isFetched && !stateSelector.isFetching) {
      const selectedSection = stateSelector.response?.content || [];
      setInternalState(selectedSection);
    }
  }, [stateSelector, dispatch]);

  return internalState;
};
