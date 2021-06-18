import axios from 'axios';
import { FileItem } from 'plugin/types';
import { useMemo, useState } from 'react';
import { API_URL } from './appModuleConfiguration';

export interface FMConfig {
  rootFolder: FileItem;
  qaiFolder: FileItem;
}
export const useFMConfig = () => {
  const [fmConfig, setFmConfig] = useState(undefined as FMConfig | undefined);

  useMemo(() => {
    axios
      .get<FMConfig>(`${API_URL}/files/config`)
      .then(response => {
        setFmConfig(response.data);
      })
      .catch(err => {
        console.error(err);
        throw err;
      });
  }, []);

  return fmConfig;
};
