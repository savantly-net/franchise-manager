import { Icon, IconName, IconSize } from '@sprout-platform/ui';
import React from 'react';

interface OwnProps {
  size?: IconSize;
  name?: IconName;
}
export const LoadingIcon = ({ size = '6x', name = 'cog' }: OwnProps) => {
  return <Icon name={name} size={size} spin />;
};
