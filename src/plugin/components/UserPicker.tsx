import { FormField, FormFieldProps } from '@sprout-platform/ui';
import { UserSearchItem } from 'plugin/services/userService';
import React, { Fragment } from 'react';

export interface UserPickerProps extends FormFieldProps {
  users: UserSearchItem[];
}

export const UserPicker = (props: UserPickerProps) => {
  const { users } = props;
  return (
    <Fragment>
      <FormField as="select" {...props}>
        <option></option>
        <Fragment>
          {users &&
            users.map((t, index) => (
              <option key={index} value={t.itemId}>
                {t.displayName}
              </option>
            ))}
        </Fragment>
      </FormField>
    </Fragment>
  );
};
