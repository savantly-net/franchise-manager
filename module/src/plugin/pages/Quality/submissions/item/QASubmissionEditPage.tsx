import { LoadingIcon } from '@sprout-platform/ui';
import React, { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useQASubmission } from '../hooks';
import QASubmissionEditor from './QASubmissionEditor';

const QAISubmissionEditPage = () => {
  const submissionId = useParams().itemId;
  const qaSubmission = useQASubmission(submissionId);
  const showLoading = !qaSubmission;

  return (
    <Fragment>
      {showLoading && <LoadingIcon />}
      {qaSubmission && (
        <QASubmissionEditor draftSubmission={qaSubmission} onChange={values => values} formDataReset={value => value} />
      )}
    </Fragment>
  );
};

export default QAISubmissionEditPage;
