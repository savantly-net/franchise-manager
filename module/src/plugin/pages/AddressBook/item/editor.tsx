import { FormField, ItemEditorProps } from '@sprout-platform/ui';
import { css } from 'emotion';
import { Form, Formik, FormikProps } from 'formik';
import React, { Fragment, useState } from 'react';
import { Prompt, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'reactstrap';
import {
  AddressBookEntry as EntityClass,
  addressBookService as service,
  addressBookStateProvider as stateProvider,
} from '../entity';

export const AddressBookEntryEditor = ({ item, afterSave }: ItemEditorProps<EntityClass>) => {
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
          return errors;
        }}
        validateOnBlur={true}
        onSubmit={(values, helpers) => {
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
            <FormField name="attributes.name" label="Name" wrapperProps={wrapperProps} />
            <FormField name="attributes.phoneNumber" label="Phone" wrapperProps={wrapperProps} />
            <FormField name="attributes.address" label="Address" wrapperProps={wrapperProps} />
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

const wrapperProps = {
  className: css`
    padding: 0;
  `,
};
