import { FormField } from '@sprout-platform/ui';
import { css } from 'emotion';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import React, { Fragment, useState } from 'react';
import { Prompt, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'reactstrap';
import { FranchiseGroup, franchiseGroupsStateProvider, groupService } from './entity';

export interface FranchiseGroupEditorProps {
  item: FranchiseGroup;
  afterSave: (values: any, helpers: FormikHelpers<any>) => void;
}

export const FranchiseGroupEditor = ({ item, afterSave }: FranchiseGroupEditorProps) => {
  const navigate = useNavigate();
  const [itemState] = useState(item || franchiseGroupsStateProvider.props.initialState.example);
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
          const promiseToSave = values.itemId
            ? groupService.update(values.itemId, values)
            : groupService.create(values);
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
        {(props: FormikProps<FranchiseGroup>) => (
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
            <FormField name="address1" label="Address1" />
            <FormField name="address2" label="Address2" />
            <FormField name="city" label="City" />
            <FormField name="state" label="State" />
            <FormField name="zip" label="Zip" />
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};
