import { useMemo } from 'react';

const useRandomId: (prefix: string) => string = (prefix = 'randomId') => {
  const id = useMemo(() => {
    return `${prefix}-${Math.random()}`;
  }, [prefix]);
  return id;
};

export default useRandomId;
