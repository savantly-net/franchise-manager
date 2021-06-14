import { Form, FormField } from '@sprout-platform/ui';
import { FormikHelpers } from 'formik';
import React, { FC } from 'react';
import { QAIQuestionCategory } from './entity';

export interface QAIQuestionCategoryEditorProps {
  entity: QAIQuestionCategory;
  onSubmit: (values: QAIQuestionCategory, helpers: FormikHelpers<QAIQuestionCategory>) => void;
  onCancel: () => void;
}

export const QAIQuestionCategoryEditor: FC<QAIQuestionCategoryEditorProps> = ({
  entity,
  onSubmit,
  onCancel,
}: QAIQuestionCategoryEditorProps) => {
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
