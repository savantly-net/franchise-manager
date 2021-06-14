import { getApiService } from '@savantly/sprout-runtime';
import { LoadingIcon } from '@sprout-platform/ui';
import _ from 'lodash';
import { FORMS_API_URL } from 'plugin/config/appModuleConfiguration';
import { AppFormSubmissionDto } from 'plugin/services/forms';
import React, { Fragment, useMemo, useState } from 'react';
import { Form } from 'react-formio';
import { Alert } from 'reactstrap';

//@ts-ignore
const Formio = window.Formio;
//import { useParams } from 'react-router-dom';

export interface StoreVisitFormEditProps {
  formDefinitionId: string;
  formData?: AppFormSubmissionDto;
  readOnly?: boolean;
  onSubmit?: (value: AppFormSubmissionDto) => void;
  onChange?: (value: AppFormSubmissionDto) => void;
}

export const StoreVisitFormEdit = ({
  formDefinitionId,
  onSubmit,
  onChange,
  readOnly,
  formData,
}: StoreVisitFormEditProps) => {
  const [busy, isBusy] = useState(false);
  const [error, setError] = useState('');
  const [formDefinition, setFormDefinition] = useState(undefined as any | undefined);
  const submission = _.clone(formData) || {};
  submission.formId = submission?.formId || formDefinitionId;

  useMemo(() => {
    if (!busy && !formDefinition) {
      isBusy(true);
      getApiService()
        .get(`${FORMS_API_URL}/form/${formDefinitionId}`)
        .then(response => {
          setFormDefinition(response.data);
        })
        .catch((error: any) => {
          setError(error.message || 'Failed to get form');
        })
        .finally(() => {
          isBusy(false);
        });
    }
  }, [busy, formDefinition, formDefinitionId]);

  if (busy) {
    return <LoadingIcon />;
  }

  return (
    <Fragment>
      {formDefinition && (
        <div>
          {error && <Alert>{error}</Alert>}
          <Form
            form={formDefinition}
            url={`${FORMS_API_URL}/form/${formDefinitionId}`}
            options={{
              ...{
                template: 'bootstrap3',
                iconset: 'fa',
                noAlerts: true,
                readOnly: readOnly,
              },
            }}
            onSubmit={onSubmit}
            onChange={onChange}
            submission={formData}
          />
        </div>
      )}
    </Fragment>
  );
};
