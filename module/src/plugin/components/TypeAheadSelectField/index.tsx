import React from 'react';
import { useField, useFormikContext } from 'formik';
import { FormControl, FormLabel } from '@chakra-ui/react';
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from '@choc-ui/chakra-autocomplete';

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
  const { setFieldValue } = useFormikContext();
  const [field, { value }] = useField(name);
  return (
    <>
      <div key={field.name}>
        <FormControl>
          <FormLabel>{label}</FormLabel>
          <AutoComplete
            openOnFocus
            onChange={val => setFieldValue(field.name, val)}
            defaultValues={[value]}
            suggestWhenEmpty
            listAllValuesOnFocus
          >
            <AutoCompleteInput variant="filled" placeholder="Search..."></AutoCompleteInput>
            <AutoCompleteList>
              {items.map(({ value, displayText }) => (
                <AutoCompleteItem key={value} value={value}>
                  {displayText || value}
                </AutoCompleteItem>
              ))}
            </AutoCompleteList>
          </AutoComplete>
        </FormControl>
      </div>
    </>
  );
};

export default TypeAheadSelectField;
