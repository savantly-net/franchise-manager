import { Form, FormField } from '@sprout-platform/ui';
import { FormikHelpers } from 'formik';
import React, { FC, Fragment } from 'react';
import { FranchiseLocation } from '../types';
import { FranchiseFee } from './feeEntity';
import { FranchiseFeeType } from './feeTypesEntity';

export interface FranchiseFeeEditorProps {
  entity: FranchiseFee;
  feeTypes: FranchiseFeeType[];
  locations: FranchiseLocation[];
  onSubmit: (values: FranchiseFee, helpers: FormikHelpers<FranchiseFee>) => void;
  onCancel: () => void;
}

export const FranchiseFeeEditor: FC<FranchiseFeeEditorProps> = ({
  entity,
  feeTypes,
  locations,
  onSubmit,
  onCancel,
}: FranchiseFeeEditorProps) => {
  /*
  const getSelectedDefaultAmount = (fee: FranchiseFee) => {
    const found = feeTypes.filter(feeType => feeType.itemId === fee.feeTypeId);
    if (found.length > 0) {
      return found[0].defaultAmount.toString();
    } else {
      return '0';
    }
  };
  */
  return (
    <Form initialValues={entity} onSubmit={onSubmit} onCancel={onCancel}>
      {({ values }) => (
        <>
          <FormField name="locationId" label="Location" as="select">
            <option></option>
            <Fragment>
              {locations && locations.map(location => <option value={location.id}>{location.name}</option>)}
            </Fragment>
          </FormField>
          <FormField name="feeTypeId" label="Fee Type" as="select">
            <option></option>
            <Fragment>
              {feeTypes &&
                feeTypes.map((feeType, index) => (
                  <option key={index} value={feeType.itemId}>
                    {feeType.name} [{feeType.defaultAmount}]
                  </option>
                ))}
            </Fragment>
          </FormField>
          <FormField name="startDate" label="Start Date" type="date" />
          <FormField name="endDate" label="End Date" type="date" />
          <FormField name="overrideAmount" label="Amount" type="number" placeholder={'use default'} />
        </>
      )}
    </Form>
  );
};
