import { getUserContextService } from '@savantly/sprout-runtime';
import { LoadingIcon } from '@sprout-platform/ui';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useQAQuestionCategories } from '../../categories/hooks';
import { useQASections } from '../../sections/hooks';
import { generateEmptyQASubmission, QASubmission } from '../entity';
import QASubmissionEditor from './QASubmissionEditor';

const QASubmissionCreate = () => {
  const log = (msg: any) => {
    console.info(`QASubmissionCreate: ${msg}`);
  };

  const allQASections = useQASections();
  const allQAQuestionCategories = useQAQuestionCategories();
  const userContext = getUserContextService().getUserContext();

  let storageKey = 'QASubmissionData';
  let removeKey = '';

  const [draftSubmission, setDraftSubmission] = useState<QASubmission | undefined>();

  const getDataLocally = (): QASubmission | undefined => {
    const dataObj = localStorage.getItem(storageKey);
    if (dataObj) {
      return JSON.parse(dataObj);
    } else {
      return undefined;
    }
  };
  const localData = getDataLocally();
  const hasLocalData = localData !== undefined;
  log(`hasLocalData: ${hasLocalData}`);

  useMemo(() => {
    if (!draftSubmission) {
      let draft;
      if (allQASections && allQAQuestionCategories) {
        const emptySubmission = generateEmptyQASubmission(allQASections, allQAQuestionCategories);
        emptySubmission.fsc = userContext.user?.name;
        console.log(`setting draftSubmission to emptySubmission: ${emptySubmission}`);
        draft = emptySubmission;
      }
      if (hasLocalData) {
        console.log(`setting draftSubmission to localdata: ${localData}`);
        draft = localData;
      }
      setDraftSubmission(draft);
    }
  }, [allQASections, allQAQuestionCategories, hasLocalData, userContext, localData, draftSubmission]);

  const [dataProps, setDataProps] = useState<any>();
  useEffect(() => {
    const alertUser = (e: any, newValue: any) => {
      if (newValue) {
        localStorage.setItem(storageKey, JSON.stringify(newValue));
      }
      if (removeKey) {
        localStorage.removeItem(storageKey);
      }
      e.preventDefault();
      e.returnValue = '';
    };
    if (dataProps) {
      window.addEventListener('beforeunload', (e: any) => alertUser(e, dataProps));
      window.removeEventListener('beforeunload', (e: any) => alertUser(e, dataProps));
      if (removeKey) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, JSON.stringify(dataProps));
      }
    }
  }, [dataProps, removeKey, storageKey]);

  const showLoading = !allQASections || !allQAQuestionCategories || !userContext || !draftSubmission;

  log(`loading: ${showLoading}`);
  log(`draftSubmission: ${draftSubmission}`);

  return (
    <Fragment>
      {showLoading && <LoadingIcon />}
      {draftSubmission && (
        <QASubmissionEditor
          draftSubmission={draftSubmission}
          onChange={values => setDataProps(values)}
          afterSubmit={() => {
            localStorage.removeItem(storageKey);
          }}
        />
      )}
    </Fragment>
  );
};

export default QASubmissionCreate;
