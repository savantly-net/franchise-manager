import { publishErrorNotification } from '@savantly/sprout-api';
import { getUserContextService } from '@savantly/sprout-runtime';
import { LoadingIcon } from '@sprout-platform/ui';
import { useLocalStorage } from 'plugin/state/LocalStorage';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
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
  const navigate = useNavigate();

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

  useEffect(() => {
    const alertUser = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', alertUser);
    return () => {
      window.removeEventListener('beforeunload', alertUser);
    };
  }, []);

  const showLoading = !allQASections || !allQAQuestionCategories || !userContext;

  const resetFormData = (props: any) => {
    setToEmptySubmission();
  };

  const RestoreFromHistoryButton = () => {
    if (localHistoryState) {
      return (
        <Button
          color="primary"
          onClick={() => {
            log(`setting draftSubmission from local history: ${localHistoryState.modifiedDate}`);
            setDraftSubmission(localHistoryState.data);
          }}
        >
          Restore From Auto-Save
        </Button>
      );
    } else {
      return <Fragment />;
    }
  };

  const CreateNewSubmissionButton = () => {
    return (
      <Button color="secondary" onClick={setToEmptySubmission}>
        Create New Submission
      </Button>
    );
  };

  const RestorationChoice = () => {
    return (
      <div
        style={{
          maxWidth: '900px',
          margin: 'auto',
        }}
      >
        <Col>
          <div>
            <h2>We found an auto-saved form</h2>
          </div>
          <Row>
            <Col>
              <div>
                <h3>Do you want to restore it?</h3>
              </div>
              <RestoreFromHistoryButton />
            </Col>
            <Col>
              <div>
                <h3>Or create a new submission?</h3>
              </div>
              <CreateNewSubmissionButton />
            </Col>
          </Row>
        </Col>
      </div>
    );
  };

  if (!showLoading && !draftSubmission && !localHistoryState) {
    setToEmptySubmission();
  }

  return (
    <Fragment>
      {showLoading && <LoadingIcon />}
      {!showLoading && !draftSubmission && localHistoryState && <RestorationChoice />}
      {draftSubmission && (
        <QASubmissionEditor
          draftSubmission={draftSubmission}
          onChange={values => setLocalHistoryState(newQASubmissionHistoryItem(values))}
          afterSubmit={(id?: string) => {
            if (id) {
              navigate(`../${id}/score`);
              setLocalHistoryState(undefined);
            } else {
              publishErrorNotification('Submission ID not returned');
              console.error('submissionId not returned. check server logs.');
            }
          }}
          formDataReset={value => resetFormData(value)}
        />
      )}
    </Fragment>
  );
};

export default QASubmissionCreate;
