import { FormField } from '@sprout-platform/ui';
import { css } from 'emotion';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import TypeAheadSelectField from 'plugin/component/TypeAheadSelectField';
import React, { Fragment, useMemo, useState } from 'react';
import { Prompt, useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Row } from 'reactstrap';
import { FranchiseVendor, franchiseVendorStateProvider, vendorService } from './entity';
import { vendorTypeService } from './type/entity';

export interface FranchiseVendorEditorProps {
  item: FranchiseVendor;
  afterSave: (values: any, helpers: FormikHelpers<any>) => void;
}

export const FranchiseVendorEditor = ({ item, afterSave }: FranchiseVendorEditorProps) => {
  const navigate = useNavigate();
  const [itemState] = useState(item || franchiseVendorStateProvider.props.initialState.example);
  const [error, setError] = useState('');
  const [vendorType, setVendorType] = useState<any>();
  const [vendorTypeOptions, setVendorTypeOptions] = useState(
    undefined as
      | Array<{
          value: any;
          displayText: string;
        }>
      | undefined
  );
  useMemo(() => {
    if (!vendorType) {
      vendorTypeService.load().then(result => {
        setVendorType(result?.data);
      });
    } else {
      setVendorTypeOptions(
        vendorType['content'].map((o: any) => {
          return {
            value: o.name,
            displayText: o.name,
          };
        })
      );
    }
  }, [vendorType]);

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
                <FormField name="notes" label="Notes" />
              </Col>
              <Col>
                <FormField name="emailAddress" label="Email Address" />
                <FormField name="mailingAddress" label="Mailing Address" />
                <Col>
                  <TypeAheadSelectField
                    name={`typeId`}
                    label="Type"
                    items={vendorTypeOptions ? vendorTypeOptions : []}
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
