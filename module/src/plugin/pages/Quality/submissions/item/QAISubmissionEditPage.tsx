import { LoadingIcon } from '@sprout-platform/ui';
import { AppModuleRootState } from 'plugin/types';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { qaiQuestionCategoryStateProvider } from '../../categories/entity';
// import { qaiSectionStateProvider } from '../../sections/entity';
import { useQAISection } from '../../sections/hooks';
import { QAISectionSubmissionEditModel } from '../entity';
// import { QAISectionSubmissionEditModel, qaiSubmissionService } from '../entity';
import { useQAISectionSubmission } from '../hooks';
// import { QAISubmissionEditor } from './editor';
// import { convertQAISubmissionEditModel, updateQaiSubmissionEditModel } from './qaiSubmissionEditModelUtil';
import { updateQaiSubmissionEditModel } from './qaiSubmissionEditModelUtil';

type InternalState = QAISectionSubmissionEditModel | undefined;

const QAISubmissionEditPage = () => {
  const categoryState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiQuestionCategories);
  const dispatch = useDispatch();
  const [error] = useState('');
  // const [error, setError] = useState('');
  const [draftSubmission, setDraftSubmission] = useState(undefined as InternalState);
  // const navigate = useNavigate();
  const submissionId = useParams().itemId;
  const qaiSectionSubmission = useQAISectionSubmission(submissionId);
  const qaiSection = useQAISection(qaiSectionSubmission?.sectionId);

  useMemo(() => {
    if (!draftSubmission && submissionId && qaiSectionSubmission && categoryState.response && qaiSection) {
      console.log('creating draft submission', qaiSectionSubmission, categoryState.response?.content, qaiSection);
      const model = updateQaiSubmissionEditModel({
        entity: qaiSectionSubmission,
        questionCategories: categoryState.response?.content,
        section: qaiSection,
      });
      console.log('created draft submission', model);
      setDraftSubmission(model);
    }
  }, [submissionId, draftSubmission, qaiSection, categoryState.response, qaiSectionSubmission]);

  useMemo(() => {
    if (!categoryState.isFetched && !categoryState.isFetching) {
      dispatch(qaiQuestionCategoryStateProvider.loadState());
    }
  }, [categoryState, dispatch]);

  const showLoading = !qaiSection || !qaiSection;

  return (
    <div>
      {error && <Alert color="warning">{error}</Alert>}
      <div>{showLoading && <LoadingIcon className="m-auto" />}</div>
      <div className="mb-2">
        {/* {qaiSection && draftSubmission && (
          <QAISubmissionEditor
            initialValue={draftSubmission}
            onSubmit={(value, helpers) => {
              qaiSubmissionService
                .update(value.itemId, convertQAISubmissionEditModel(value))
                .then(response => {
                  helpers.resetForm();
                  dispatch(qaiSectionStateProvider.loadState());
                  navigate(`../`);
                })
                .catch(err => {
                  console.error(err);
                  setError(err.message || 'There was a problem saving the content. Check the logs.');
                })
                .finally(() => {
                  helpers.setSubmitting(false);
                });
            }}
            onCancel={() => console.log('cancelled')}
          />
        )} */}
      </div>
    </div>
  );
};

export default QAISubmissionEditPage;
