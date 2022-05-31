import { FormFieldProps } from '@sprout-platform/ui';
import { UserSearchItem } from 'plugin/services/userService';
import React from 'react';
import TypeAheadSelectField from './TypeAheadSelectField';

export interface UserPickerProps extends FormFieldProps {
  users: UserSearchItem[];
}

export const UserPicker = (props: UserPickerProps) => {
  const { users } = props;
  return (
    <TypeAheadSelectField
      {...props}
      label={props.label}
      items={users.map(({ displayName, itemId, userName }) => ({
        value: itemId,
        displayText: `${displayName} (${userName})`,
      }))}
    />
  );
};
