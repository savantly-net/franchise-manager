import { Form, FormField } from '@sprout-platform/ui';
import { FormikHelpers } from 'formik';
import React, { FC } from 'react';
import { FranchiseFeeType } from './feeTypesEntity';

export interface FranchiseFeeTypeEditorProps {
  entity: FranchiseFeeType;
  onSubmit: (values: FranchiseFeeType, helpers: FormikHelpers<FranchiseFeeType>) => void;
  onCancel: () => void;
}

export const FranchiseFeeTypeEditor: FC<FranchiseFeeTypeEditorProps> = ({
  entity,
  onSubmit,
  onCancel,
}: FranchiseFeeTypeEditorProps) => {
  return (
    <Form initialValues={entity} onSubmit={onSubmit} onCancel={onCancel}>
      {({ values }) => (
        <>
          <FormField name="name" label="Name" />
          <FormField name="description" label="Description" />
          <FormField name="assignmentType" label="Assignment Type" as="select">
            <option>STORE</option>
            <option>LOCATION</option>
          </FormField>
          <FormField name="enabled" label="Enabled" type="checkbox" />
          <FormField name="feeAmountType" label="Amount Type" as="select">
            <option>DOLLAR</option>
            <option>PERCENTAGE</option>
          </FormField>
          <FormField name="recurring" label="Recurring Fee" type="checkbox" />
          <FormField name="recurringInterval" label="Recurring Interval" as="select">
            <option></option>
            <option>DAILY</option>
            <option>MONTHLY</option>
          </FormField>
          <FormField name="defaultAmount" label="Default Amount" type="number" />
        </>
      )}
    </Form>
  );
};
