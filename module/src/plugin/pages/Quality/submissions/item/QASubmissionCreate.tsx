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
    const alertUser = (e: any) => {
      if (removeKey) {
        localStorage.removeItem(storageKey);
      }
      e.preventDefault();
      e.returnValue = '';
    };
    if (dataProps) {
      window.addEventListener('beforeunload', (e: any) => alertUser(e));
      window.removeEventListener('beforeunload', (e: any) => alertUser(e));
      if (removeKey) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, JSON.stringify(dataProps));
      }
    }
  }, [dataProps, removeKey, storageKey]);

  const showLoading = !allQASections || !allQAQuestionCategories || !userContext || !draftSubmission;

  const resetFormData = (props: any) => {
    if (draftSubmission) {
      let draft: any;
      if (allQASections && allQAQuestionCategories) {
        const emptySubmission = generateEmptyQASubmission(allQASections, allQAQuestionCategories);
        emptySubmission.fsc = userContext.user?.name;
        draft = emptySubmission;
      }
      props.setFieldValue(`locationId`, '');
      props.setFieldValue(`dateScored`, draft.dateScored);
      props.setFieldValue(`startTime`, '');
      props.setFieldValue(`endTime`, '');
      props.setFieldValue(`managerOnDuty`, '');
      props.setFieldValue(`fsc`, draft.fsc);
      props.setFieldValue(`fsm`, '');
      props.setFieldValue(`responsibleAlcoholCert`, '');
      draftSubmission.locationId = '';
      draftSubmission.dateScored = draft.dateScored;
      draftSubmission.startTime = '';
      draftSubmission.endTime = '';
      draftSubmission.managerOnDuty = '';
      draftSubmission.fsc = draft.fsc;
      draftSubmission.fsm = '';
      draftSubmission.responsibleAlcoholCert = '';

      setTimeout(() => {
        localStorage.removeItem('QASubmissionData');
      }, 1000);

      props.values.sections.length > 0 &&
        props.values.sections.map((section: any, index: number) => {
          section.answers.length > 0 &&
            section.answers.map((answer: any, indA: number) => {
              props.setFieldValue(`sections.${index}.answers.${indA}.attachments`, []);
              props.setFieldValue(`sections.${index}.answers.${indA}.notes`, '');
              props.setFieldValue(`sections.${index}.answers.${indA}.value`, '');
              draftSubmission.sections[index].answers[indA].attachments = [];
              draftSubmission.sections[index].answers[indA].notes = '';
              draftSubmission.sections[index].answers[indA].value = undefined;
            });
          section.guestAnswers.length > 0 &&
            section.guestAnswers.map((gAnswer: any, indG: number) => {
              gAnswer.answers.length > 0 &&
                gAnswer.answers.map((answer: any, indA: number) => {
                  props.setFieldValue(`sections.${index}.guestAnswers.${indG}.answers.${indA}.value`, '');
                  draftSubmission.sections[index].guestAnswers[indG].answers[indA].value = undefined;
                });
            });
          props.setFieldValue(`sections.${index}.staffAttendance.Bartenders`, '');
          props.setFieldValue(`sections.${index}.staffAttendance.Cashiers`, '');
          props.setFieldValue(`sections.${index}.staffAttendance.Dish/Busser`, '');
          props.setFieldValue(`sections.${index}.staffAttendance.Expo`, '');
          props.setFieldValue(`sections.${index}.staffAttendance.Line Cooks`, '');
          props.setFieldValue(`sections.${index}.staffAttendance.Prep`, '');
          draftSubmission.sections[index].staffAttendance = {};
        });
    }
  };

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
          formDataReset={value => resetFormData(value)}
        />
      )}
    </Fragment>
  );
};

export default QASubmissionCreate;
