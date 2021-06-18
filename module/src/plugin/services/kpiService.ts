import { getApiService } from '@savantly/sprout-runtime';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import { useMemo, useState } from 'react';

export interface KpiList {
  [name: string]: any;
}

export const kpiService = {
  getKpis: () => {
    return getApiService().get<KpiList>(`${API_URL}/kpi`);
  },
  getKpisByLocationId: (locationId: string) => {
    return getApiService().get<KpiList>(`${API_URL}/kpi/${locationId}`);
  },
};

export const useKpis = (): KpiList | undefined => {
  const [fetching, isFetching] = useState('' as any);
  const [internalState, setInternalState] = useState(undefined as KpiList | undefined);

  useMemo(() => {
    if (!internalState && !fetching) {
      isFetching(true);
      kpiService
        .getKpis()
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

export const useKpisByLocationId = (locationId: string | undefined): KpiList | undefined => {
  const [fetching, isFetching] = useState('' as any);
  const [internalState, setInternalState] = useState(undefined as KpiList | undefined);

  useMemo(() => {
    if (!internalState && !fetching && locationId) {
      isFetching(true);
      kpiService
        .getKpisByLocationId(locationId)
        .then(response => {
          isFetching(false);
          setInternalState(response.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [fetching, internalState, locationId]);

  return internalState;
};
