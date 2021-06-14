import { FormField, ItemEditorProps, MarkdownEditor } from '@sprout-platform/ui';
import { css } from 'emotion';
import { Form, Formik, FormikProps } from 'formik';
import React, { Fragment, useState } from 'react';
import { Prompt, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'reactstrap';
import {
  Newsletter as EntityClass,
  newsletterService as service,
  newsletterStateProvider as stateProvider,
} from '../entityConfig';

export const NewsletterItemEditor = ({ item, afterSave }: ItemEditorProps<EntityClass>) => {
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
          if (!values.title) {
            errors['title'] = {
              required: 'A title is required',
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
            <FormField
              name="title"
              label="Title"
              wrapperProps={{
                className: css`
                  padding: 0;
                `,
              }}
            />
            <MarkdownEditor
              value={props.values.text}
              onChange={markdown => {
                props.setFieldValue('text', markdown);
              }}
              initialEditorHeight={500}
              minPreviewHeight={500}
            />
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};
