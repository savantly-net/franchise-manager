import React from 'react';
import { useField } from 'formik';
import { FormControl, FormLabel } from '@chakra-ui/react';
import { FormField } from '@sprout-platform/ui';

interface AutoCompleteItemProps {
  value: string;
  displayText: string;
}

export interface TypeAheadSelectFieldProps {
  name: string;
  label: string;
  items: AutoCompleteItemProps[];
}

const TypeAheadSelectField = ({ name, label, items }: TypeAheadSelectFieldProps) => {
  const [field] = useField(name);
  return (
    <>
      <div key={field.name}>
        <FormControl>
          <FormLabel>{label}</FormLabel>
          <FormField name={name} className="mb-1" as="select" required="required">
            <>
              <option></option>
              {items &&
                items.map(({ value, displayText }) => (
                  <option key={value} value={value}>
                    {displayText}
                  </option>
                ))}
            </>
          </FormField>
        </FormControl>
      </div>
    </>
  );
};

export default TypeAheadSelectField;
