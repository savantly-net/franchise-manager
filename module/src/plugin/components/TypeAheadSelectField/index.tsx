import React from 'react';
import { useField, useFormikContext } from 'formik';
import { FormControl, FormLabel } from '@chakra-ui/react';
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from '@choc-ui/chakra-autocomplete';

interface AutoCompleteItemProps {
  value: string;
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
        <FormControl w="60">
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
              {items.map(({ value }) => (
                <AutoCompleteItem key={value} value={value}>
                  {value}
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
