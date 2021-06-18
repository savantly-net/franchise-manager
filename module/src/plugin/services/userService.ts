import { getApiService } from '@savantly/sprout-runtime';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import { useMemo, useState } from 'react';

export interface UserSearchItem {
  itemId: string;
  userName: string;
  displayName: string;
}

export const userService = {
  getUsers: () => {
    return getApiService().get<UserSearchItem[]>(`${API_URL}/../users`);
  },
};

export const useAppUsers = (): UserSearchItem[] | undefined => {
  const [fetching, isFetching] = useState('' as any);
  const [internalState, setInternalState] = useState(undefined as UserSearchItem[] | undefined);

  useMemo(() => {
    if (!internalState && !fetching) {
      isFetching(true);
      userService
        .getUsers()
        .then(response => {
          isFetching(false);
          setInternalState(response.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [fetching, internalState]);

  return internalState;
};
