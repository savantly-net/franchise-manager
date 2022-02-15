import { FieldProps } from 'formik';
import React from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

import './styles.scss';

interface Props {
  label?: string;
  placeholder?: string;
}

const FormikTextInput: React.FC<FieldProps & Props> = ({ field, form, placeholder, label }) => (
  <FormControl>
    {label && <FormLabel className="FormikTextInput__label">{label}</FormLabel>}
    <Input
      placeholder={placeholder}
      onChange={(e: any) => form.setFieldValue(field.name, e.target.value)}
      onBlur={field.onBlur}
      name={field.name}
      value={field.value}
    />
  </FormControl>
);

export default FormikTextInput;
