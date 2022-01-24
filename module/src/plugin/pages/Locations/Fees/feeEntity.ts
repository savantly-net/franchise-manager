import { BaseEntityService, dateTime, EntityState, EntityStateProvider, TenantedEntity } from '@savantly/sprout-api';
import { getApiService } from '@savantly/sprout-runtime';

import { API_URL } from 'plugin/config/appModuleConfiguration';
// import { ColumnDescription } from 'react-bootstrap-table-next';

export interface FranchiseFee extends TenantedEntity {
  locationId: string;
  feeTypeId: string;
  startDate: string;
  endDate?: string;
  itemId?: string;
  overrideAmount?: number;
  amount?: number;
}

export type FranchiseFeeState = EntityState<FranchiseFee>;

class FeeServiceService extends BaseEntityService<FranchiseFee> {
  constructor() {
    super({
      baseUrl: `${API_URL}/fees`,
    });
  }
}

export const locationFeeService = {
  getLocations: () => {
    return getApiService().get<FranchiseFee[]>(`${API_URL}/locations`);
  },
  createLocationFees: (location: FranchiseFee) => {
    return getApiService().post(`${API_URL}/fees/`, location);
  },
  updateLocationFees: (location: FranchiseFee, itemId: string) => {
    return getApiService().put(`${API_URL}/fees/${itemId}`, location);
  },
};

const franchiseFeeService = new FeeServiceService();
export { franchiseFeeService };

export const franchiseFeesStateProvider = new EntityStateProvider<FranchiseFee>({
  entityService: franchiseFeeService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      locationId: '',
      feeTypeId: '',
      startDate: dateTime().format('YYYY-MM-DD'),
    },
  },
  stateKey: 'franchise-fees',
});
