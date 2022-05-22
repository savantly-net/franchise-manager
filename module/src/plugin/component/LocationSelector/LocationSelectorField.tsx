import { Field, FieldProps } from 'formik';
import { LocationSelector } from 'plugin/component/LocationSelector/LocationSelector';
import React from 'react';

export interface LocationSelectorFieldProps {
  name: string;
}
export const LocationSelectorField = (props: LocationSelectorFieldProps) => {
  return (
    <Field name={props.name}>
      {({
        field, // { name, value, onChange, onBlur }
        form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        meta,
      }: FieldProps) => (
        <div>
          <label>Select Location</label>
          <LocationSelector
            initialValue={field.value}
            onChange={v => {
              setFieldValue(props.name, v);
            }}
          />
          {meta.touched && meta.error && <div className="error">{meta.error}</div>}
        </div>
      )}
    </Field>
  );
};
