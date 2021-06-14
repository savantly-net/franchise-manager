import { BaseEntityService, EntityStateProvider, PagedEntityState, TenantedEntity } from '@savantly/sprout-api';
import { getApiService } from '@savantly/sprout-runtime';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import { AppFormSubmissionDto } from 'plugin/services/forms';
import { useMemo, useState } from 'react';

export interface StoreVisit extends TenantedEntity {
  itemId?: string;
  locationId?: string;
  formDataId?: string;
  sectionSubmissionId?: string;
  formData?: AppFormSubmissionDto;

  /**
   * Transient
   */
  createdDate?: string;
}

export interface StoreVisitDynamicFields {
  [name: string]: any;
}

export type StoreVisitState = PagedEntityState<StoreVisit>;

class StoreVisitService extends BaseEntityService<StoreVisit> {
  constructor() {
    super({
      baseUrl: `${API_URL}/store-visit`,
    });
  }
  getDynamicFields = (locationId: string) => {
    return getApiService().get<StoreVisitDynamicFields>(`${API_URL}/store-visit/dynamic-fields/${locationId}`);
  };
}
const storeVisitService = new StoreVisitService();
export { storeVisitService };

export const useStoreVisitDynamicFieldsByLocationId = (
  locationId: string | undefined
): StoreVisitDynamicFields | undefined => {
  const [fetching, isFetching] = useState('' as any);
  const [internalState, setInternalState] = useState(undefined as StoreVisitDynamicFields | undefined);

  useMemo(() => {
    if (!internalState && !fetching && locationId) {
      isFetching(true);
      storeVisitService
        .getDynamicFields(locationId)
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

export const storeVisitStateProvider = new EntityStateProvider<StoreVisit>({
  entityService: storeVisitService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {},
  },
  stateKey: 'franchise-store-visit',
});
