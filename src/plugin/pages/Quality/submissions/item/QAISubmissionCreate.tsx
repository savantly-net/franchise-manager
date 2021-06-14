import { LoadingIcon } from '@sprout-platform/ui';
import { LocationSelector } from 'plugin/pages/Locations/Stores/components/LocationSelector';
import { AppModuleRootState } from 'plugin/types';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { qaiQuestionCategoryStateProvider } from '../../categories/entity';
import { QAISection, qaiSectionStateProvider } from '../../sections/entity';
import { QAISectionSubmissionEditModel, qaiSubmissionService } from '../entity';
import { QAISubmissionEditor } from './editor';
import { convertQAISubmissionEditModel, createQaiSubmissionEditModel } from './qaiSubmissionEditModelUtil';

type InternalState = QAISectionSubmissionEditModel | undefined;
type SectionDefinition = QAISection | undefined;

const QAISubmissionCreate = () => {
  const submissionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSubmissions);
  const sectionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSections);
  const categoryState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiQuestionCategories);
  const dispatch = useDispatch();
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [error, setError] = useState('');
  const [draftSubmission, setDraftSubmission] = useState(undefined as InternalState);
  const [sectionDefinition, setSectionDefinition] = useState(undefined as SectionDefinition);
  const navigate = useNavigate();

  useMemo(() => {
    if (!sectionState.isFetched && !sectionState.isFetching) {
      dispatch(qaiSectionStateProvider.loadState());
    }
    if (!categoryState.isFetched && !categoryState.isFetching) {
      dispatch(qaiQuestionCategoryStateProvider.loadState());
    }
  }, [sectionState, categoryState, dispatch]);

  useMemo(() => {
    const found = sectionState.response?.filter(s => s.itemId === selectedSection);
    if (found && found.length > 0) {
      setSectionDefinition(found[0]);
    }
  }, [sectionState, selectedSection]);

  useMemo(() => {
    if (selectedSection) {
      if (!sectionDefinition || !categoryState.response) {
        return;
      }
      setDraftSubmission(
        createQaiSubmissionEditModel({
          locationId: selectedLocation,
          questionCategories: categoryState.response?.content,
          section: sectionDefinition,
        })
      );
    }
  }, [selectedSection, selectedLocation, categoryState, sectionDefinition]);

  const handleSectionSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedSection !== event.currentTarget.value) {
      setSelectedSection(event.currentTarget.value);
    }
  };

  const showLoading = sectionState.isFetching || submissionState.isFetching;

  return (
    <div>
      {error && <Alert color="warning">{error}</Alert>}
      <div className="d-flex mb-3">
        <div className="col-4">
          <label>Select Location</label>
          <LocationSelector
            initialValue={selectedLocation}
            onChange={value => {
              setSelectedLocation(value);
            }}
          />
        </div>
        <div className="col-4">
          <label>Select Section</label>
          <select
            className="form-control"
            name="sectionSelection"
            value={selectedSection}
            onChange={handleSectionSelectionChange}
          >
            <option></option>
            {sectionState.response &&
              sectionState.response.map(s => (
                <option key={s.itemId} value={s.itemId}>
                  {s.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div>{showLoading && <LoadingIcon className="m-auto" />}</div>
      <div className="mb-2">
        {sectionDefinition && draftSubmission && (
          <QAISubmissionEditor
            initialValue={draftSubmission}
            onSubmit={(value, helpers) => {
              qaiSubmissionService
                .create(convertQAISubmissionEditModel(value))
                .then(response => {
                  helpers.resetForm();
                  dispatch(qaiSectionStateProvider.loadState());
                  navigate(`../item/${response.data.itemId}`);
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
        )}
      </div>
    </div>
  );
};

export default QAISubmissionCreate;
