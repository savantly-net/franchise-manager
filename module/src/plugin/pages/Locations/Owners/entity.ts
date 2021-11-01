import {
  BaseEntityService,
  dateTime,
  EntityStateProvider,
  PagedEntityState,
  TenantedEntity,
} from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface FranchiseOwnership extends TenantedEntity {
  incorporatedName: string;
  storeId: string;
  locationId: string;
  groupId: string;
  startDate: string;
  endDate?: string;
}

export type FranchiseOwnershipState = PagedEntityState<FranchiseOwnership>;

class FranchiseOwnershipService extends BaseEntityService<FranchiseOwnership> {
  constructor() {
    super({
      baseUrl: `${API_URL}/owners`,
    });
  }
}
const franchiseOwnershipService = new FranchiseOwnershipService();
export { franchiseOwnershipService };

export const franchiseOwnershipStateProvider = new EntityStateProvider<FranchiseOwnership>({
  entityService: franchiseOwnershipService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      incorporatedName: 'New Ownership',
      storeId: '',
      locationId: '',
      groupId: '',
      startDate: dateTime().format('YYYY-MM-DD'),
    },
  },
  stateKey: 'franchise-ownership',
});

export const franchiseOwnershipColumns = [
  {
    dataField: 'incorporatedName',
    text: 'Incorporated Name',
    sort: true,
  },
  {
    dataField: 'storeId',
    text: 'Store ID',
    sort: true,
  },
  {
    dataField: 'locationId',
    text: 'Location',
  },
  {
    dataField: 'groupId',
    text: 'Group',
  },
  {
    dataField: 'startDate',
    text: 'Start',
    sort: true,
  },
  {
    dataField: 'endDate',
    text: 'End',
    sort: true,
  },
];
