import { Icon, IconName, IconProps } from '@sprout-platform/ui';
import React from 'react';

interface OwnProps extends Omit<IconProps, 'name'> {
  name?: IconName;
}
export const LoadingIcon = ({ size = '6x', name = 'cog' }: OwnProps) => {
  return <Icon name={name} size={size} spin />;
};
