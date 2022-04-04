import { Form, FormField } from '@sprout-platform/ui';
import { FormikHelpers } from 'formik';
import React, { FC } from 'react';
import { QAQuestionCategory } from './entity';

export interface QAQuestionCategoryEditorProps {
  entity: QAQuestionCategory;
  onSubmit: (values: QAQuestionCategory, helpers: FormikHelpers<QAQuestionCategory>) => void;
  onCancel: () => void;
}

export const QAQuestionCategoryEditor: FC<QAQuestionCategoryEditorProps> = ({
  entity,
  onSubmit,
  onCancel,
}: QAQuestionCategoryEditorProps) => {
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
