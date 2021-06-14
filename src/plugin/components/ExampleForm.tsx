import { LoadingPlaceholder } from '@savantly/sprout-ui';
import { Form, FormField } from '@sprout-platform/ui';
import React, { Fragment } from 'react';
import { Col, Row } from 'reactstrap';

export interface ExampleFormProps {
  data: any;
}

export interface ExampleFormDto {
  title?: string;
}

export const FormEdit = (props: ExampleFormProps) => {
  const saveForm = (values: ExampleFormDto) => {};

  if (!props.data) {
    return <LoadingPlaceholder text="Loading data..." />;
  }

  return (
    <div>
      <Form
        submitText="save"
        showButtonsOnTop={false}
        showCancelButton={true}
        initialValues={{}}
        validate={(values: ExampleFormDto) => {
          const errors: any = {};
          if (!values.title) {
            errors.title = 'Required';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          saveForm(values);
        }}
      >
        {({ values }) => {
          return (
            <Fragment>
              <h5>Details</h5>
              <hr />
              <Row form>
                <Col md={3}>
                  <FormField name="title" type="text" label="Title" placeholder="Enter the form title" />
                </Col>
              </Row>
            </Fragment>
          );
        }}
      </Form>
    </div>
  );
};
