import { DateField, FormField } from '@sprout-platform/ui';
import { css } from 'emotion';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import React, { Fragment, useState } from 'react';
import { Prompt, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'reactstrap';
import { StorePos, storePosService, storePosStateProvider } from './entity';

export interface StorePosEditorProps {
  item: StorePos;
  afterSave: (values: any, helpers: FormikHelpers<any>) => void;
}

export const StorePosEditor = ({ item, afterSave }: StorePosEditorProps) => {
  const navigate = useNavigate();
  const [itemState] = useState(item || storePosStateProvider.props.initialState.example);
  const [error, setError] = useState('');

  return (
    <Fragment>
      {error && <Alert color="danger">{error}</Alert>}
      <Formik
        initialValues={itemState}
        validate={values => {
          const errors: any = {};
          if (!values.storeId) {
            errors['storeId'] = {
              required: 'Store ID is required',
            };
          }
          if (!values.posId) {
            errors['posId'] = {
              required: 'A POS ID is required',
            };
          }
          if (!values.startDate) {
            errors['startDate'] = {
              required: 'A Start Date is required',
            };
          }
        }}
        onSubmit={(values, helpers) => {
          console.log(values);
          const promiseToSave = values.itemId
            ? storePosService.update(values.itemId, values)
            : storePosService.create(values);
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
        {(props: FormikProps<StorePos>) => (
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
            <FormField name="storeId" label="Store ID" />
            <FormField name="posId" label="POS ID" />
            <DateField name="startDate" label="startDate" />
            <DateField name="endDate" label="endDate" />
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};
