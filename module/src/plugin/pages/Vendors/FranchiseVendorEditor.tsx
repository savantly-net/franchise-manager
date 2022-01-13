import { FormField } from '@sprout-platform/ui';
import { css } from 'emotion';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import TypeAheadSelectField from 'plugin/components/TypeAheadSelectField';
import React, { Fragment, useState } from 'react';
import { Prompt, useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Row } from 'reactstrap';
import { FranchiseVendor, franchiseVendorStateProvider, vendorService } from './entity';

export interface FranchiseVendorEditorProps {
  item: FranchiseVendor;
  afterSave: (values: any, helpers: FormikHelpers<any>) => void;
}

export const FranchiseVendorEditor = ({ item, afterSave }: FranchiseVendorEditorProps) => {
  const navigate = useNavigate();
  const [itemState] = useState(item || franchiseVendorStateProvider.props.initialState.example);
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
            ? vendorService.update(values.itemId, values)
            : vendorService.create(values);
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
        {(props: FormikProps<FranchiseVendor>) => (
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
            <Row>
              <Col>
                <FormField name="name" label="Name" />
                <FormField name="phoneNumber" label="Phone Number" />
                <FormField name="notes" label="Notes" as="textArea" rows="1" />
              </Col>
              <Col>
                <FormField name="emailAddress" label="Email Address" />
                <FormField name="mailingAddress" label="Mailing Address" as="textArea" rows="1" />
                <Col>
                  <TypeAheadSelectField
                    name={`typeId`}
                    label="Type"
                    items={[
                      { value: 'PRIMARY_CONTACT', displayText: 'PRIMARY CONTACT' },
                      { value: 'GNERAL_MANAGER', displayText: 'GNERAL MANAGER' },
                      { value: 'FSC', displayText: 'FSC' },
                      { value: 'FAC', displayText: 'FAC' },
                      { value: 'FRANCHISE_OWNER', displayText: 'FRANCHISE OWNER' },
                      { value: 'FRANCHISE_PARTNER', displayText: 'FRANCHISE PARTNER' },
                      { value: 'DISTRICT_MANAGER', displayText: 'DISTRICT MANAGER' },
                      { value: 'OTHER', displayText: 'OTHER' },
                    ]}
                  />
                </Col>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};
