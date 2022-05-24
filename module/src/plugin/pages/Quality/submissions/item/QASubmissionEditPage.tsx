import { publishErrorNotification } from '@savantly/sprout-api';
import { LoadingIcon } from '@sprout-platform/ui';
import React, { Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQASubmission } from '../hooks';
import QASubmissionEditor from './QASubmissionEditor';

const QAISubmissionEditPage = () => {
  const submissionId = useParams().itemId;
  const qaSubmission = useQASubmission(submissionId);
  const navigate = useNavigate();
  const showLoading = !qaSubmission;

  return (
    <Fragment>
      {showLoading && <LoadingIcon />}
      {qaSubmission && (
        <QASubmissionEditor
          draftSubmission={qaSubmission}
          onChange={values => values}
          formDataReset={value => value}
          afterSubmit={id => {
            if (id) {
              navigate(`../../../${id}/score`);
            } else {
              publishErrorNotification('Submission ID not returned');
              console.error('submissionId not returned. check server logs.');
            }
          }}
        />
      )}
    </Fragment>
  );
};

export default QAISubmissionEditPage;
