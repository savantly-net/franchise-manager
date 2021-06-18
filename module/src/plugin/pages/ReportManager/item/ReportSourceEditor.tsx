import { FormField, ItemEditorProps } from '@sprout-platform/ui';
import { css } from 'emotion';
import { Form, Formik, FormikProps } from 'formik';
import React, { Fragment, useState } from 'react';
import { Prompt, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'reactstrap';
import {
  ReportSource as EntityClass,
  reportSourceService as service,
  reportSourceStateProvider as stateProvider,
} from '../entityConfig';

const ReportSourceEditor = ({ item, afterSave }: ItemEditorProps<EntityClass>) => {
  const navigate = useNavigate();
  const [itemState] = useState(item || stateProvider.props.initialState.example);
  const [error, setError] = useState('');

  return (
    <Fragment>
      {error && <Alert color="danger">{error}</Alert>}
      <Formik
        initialValues={itemState}
        validate={values => {
          const errors: any = {};
          if (!values.name) {
            errors['name'] = {
              required: 'A name is required',
            };
          }
        }}
        onSubmit={(values, helpers) => {
          console.log(values);
          const promiseToSave = values.itemId ? service.update(values.itemId, values) : service.create(values);
          promiseToSave
            .then(response => {
              helpers.setSubmitting(false);
              helpers.resetForm();
              afterSave(response.data, helpers);
            })
            .catch(err => {
              setError(err.message || err.detail || 'An error occurred while saving.');
            });
        }}
      >
        {(props: FormikProps<EntityClass>) => (
          <Form>
            <Prompt message="You have unsaved changes. Are you sure?" when={props.dirty} />
            <div
              className={css`
                display: flex;
              `}
            >
              <Button className="ml-auto" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button className="ml-2" color="primary" type="submit">
                Save
              </Button>
            </div>
            <FormField name="name" label="Name" />
            <FormField name="menuPath" label="Menu Path (path|sub-path)" />
            <FormField name="sourceType" label="Source Type" as="select">
              <option>VIEW</option>
              <option>JSON</option>
            </FormField>
            <FormField name="url" label="Url" />
            <FormField name="icon" label="Icon (font-awesome class name)" />
            <FormField name="weight" type="number" label="Weight (smaller numbers rise to the top)" />
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

export default ReportSourceEditor;
