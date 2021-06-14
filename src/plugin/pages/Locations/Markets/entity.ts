import { BaseEntityService, EntityStateProvider, PagedEntityState, TenantedEntity } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface FranchiseMarket extends TenantedEntity {
  name: string;
}

export type FranchiseMarketState = PagedEntityState<FranchiseMarket>;

class FranchiseMarketService extends BaseEntityService<FranchiseMarket> {
  constructor() {
    super({
      baseUrl: `${API_URL}/markets`,
    });
  }
}
const franchiseMarketService = new FranchiseMarketService();
export { franchiseMarketService };

export const franchiseMarketStateProvider = new EntityStateProvider<FranchiseMarket>({
  entityService: franchiseMarketService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      name: 'New Market',
    },
  },
  stateKey: 'franchise-markets',
});

export const franchiseMarketColumns = [
  {
    dataField: 'name',
    text: 'Name',
    sort: true,
  },
];
