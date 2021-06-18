import { DateTimeField, FormField, ItemEditorProps, MarkdownEditor } from '@sprout-platform/ui';
import { css } from 'emotion';
import { Form, Formik, FormikProps } from 'formik';
import React, { Fragment, useState } from 'react';
import { Prompt, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'reactstrap';
import { Calendar as EntityClass, calendarService as service, calendarStateProvider as stateProvider } from '../entity';

export const CalendarItemEditor = ({ item, afterSave }: ItemEditorProps<EntityClass>) => {
  const navigate = useNavigate();
  const [itemState] = useState(item || stateProvider.props.initialState.example);
  const [error, setError] = useState('');

  return (
    <Fragment>
      {error && <Alert color="danger">{error}</Alert>}
      <Formik
        initialValues={itemState}
        validate={values => {
          console.log('validating', values);
          const errors: any = {};
          if (!values.title || values.title.length === 0) {
            errors['title'] = 'A title is required';
          }
          console.log('validation result', errors);
          return errors;
        }}
        validateOnBlur={true}
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
            <FormField name="title" label="Title" wrapperProps={wrapperProps} />
            <DateTimeField
              name="fromDate"
              label="From"
              className={css`
                padding: 0;
                margin-bottom: 1rem;
              `}
            />
            <DateTimeField
              name="toDate"
              label="To"
              className={css`
                padding: 0;
                margin-bottom: 1rem;
              `}
            />
            <MarkdownEditor
              value={props.values.text}
              onChange={markdown => {
                props.setFieldValue('text', markdown);
              }}
              initialEditorHeight={200}
              minPreviewHeight={200}
            />
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
