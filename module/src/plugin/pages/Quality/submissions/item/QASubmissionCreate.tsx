import { getUserContextService } from '@savantly/sprout-runtime';
import { LoadingIcon } from '@sprout-platform/ui';
import { useLocalStorage } from 'plugin/state/LocalStorage';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useQAQuestionCategories } from '../../categories/hooks';
import { useQASections } from '../../sections/hooks';
import { generateEmptyQASubmission, QASubmission } from '../entity';
import QASubmissionEditor from './QASubmissionEditor';

interface QASubmissionHistoryItem {
  modifiedDate: Date;
  data: QASubmission;
}

const newQASubmissionHistoryItem = (values: QASubmission): QASubmissionHistoryItem => {
  return {
    modifiedDate: new Date(),
    data: values,
  };
};

const QASubmissionCreate = () => {
  const log = (msg: any, ...args: any[]) => {
    console.info(`QASubmissionCreate: ${msg}`, args);
  };

  const allQASections = useQASections();
  const allQAQuestionCategories = useQAQuestionCategories();
  const userContext = getUserContextService().getUserContext();

  const storageKey = 'QASubmissionHistoryItem';
  const [localHistoryState, setLocalHistoryState] = useLocalStorage<QASubmissionHistoryItem | undefined>(
    storageKey,
    undefined
  );
  const [draftSubmission, setDraftSubmission] = useState<QASubmission | undefined>();

  const setToEmptySubmission = useCallback(() => {
    log(`called setToEmptySubmission`);
    if (allQASections && allQAQuestionCategories) {
      const emptySubmission = generateEmptyQASubmission(allQASections, allQAQuestionCategories);
      emptySubmission.fsc = userContext.user?.name;
      log(`setting draftSubmission to emptySubmission:`, emptySubmission);
      setDraftSubmission(emptySubmission);
    }
  }, [allQASections, allQAQuestionCategories, userContext]);

  useMemo(() => {
    if (!draftSubmission) {
      if (localHistoryState) {
        log(`setting draftSubmission from local history: ${localHistoryState.modifiedDate}`);
        setDraftSubmission(localHistoryState.data);
      } else {
        setToEmptySubmission();
      }
    }
  }, [localHistoryState, draftSubmission, setToEmptySubmission]);

  useEffect(() => {
    const alertUser = (e: BeforeUnloadEvent) => {
      if (confirm('Clear your QAA auto-save history')) {
        localStorage.removeItem(storageKey);
      }
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', alertUser);
    return () => {
      window.removeEventListener('beforeunload', alertUser);
    };
  }, []);

  const showLoading = !allQASections || !allQAQuestionCategories || !userContext || !draftSubmission;

  const resetFormData = (props: any) => {
    setToEmptySubmission();
  };

  return (
    <Fragment>
      {showLoading && <LoadingIcon />}
      {draftSubmission && (
        <QASubmissionEditor
          draftSubmission={draftSubmission}
          onChange={values => setLocalHistoryState(newQASubmissionHistoryItem(values))}
          afterSubmit={() => {
            //localStorage.removeItem(storageKey);
          }}
          formDataReset={value => resetFormData(value)}
        />
      )}
    </Fragment>
  );
};

export default QASubmissionCreate;
