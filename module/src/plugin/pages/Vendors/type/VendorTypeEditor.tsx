import { Form, FormField } from '@sprout-platform/ui';
import { FormikHelpers } from 'formik';
import React, { FC } from 'react';
import { VendorType } from './entity';

export interface VendorTypeEditorProps {
  entity: VendorType;
  onSubmit: (values: VendorType, helpers: FormikHelpers<VendorType>) => void;
  onCancel: () => void;
}

export const VendorTypeEditor: FC<VendorTypeEditorProps> = ({ entity, onSubmit, onCancel }: VendorTypeEditorProps) => {
  return (
    <Form initialValues={entity} onSubmit={onSubmit} onCancel={onCancel}>
      {({ values }) => (
        <>
          <FormField name="name" label="Name" />
        </>
      )}
    </Form>
  );
};
