import React from 'react';
import TypeAheadSelectField from './TypeAheadSelectField';
import { UserSearchItem } from 'plugin/services/userService';
import { FormFieldProps } from '@sprout-platform/ui';

export interface UserPickerProps extends FormFieldProps {
  users: UserSearchItem[];
}

export const UserPicker = (props: UserPickerProps) => {
  const { users } = props;
  return (
    <TypeAheadSelectField
      {...props}
      label="User"
      items={users.map(({ displayName, itemId }) => ({ value: itemId, displayText: displayName }))}
    />
  );
};
