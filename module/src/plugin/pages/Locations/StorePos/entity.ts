import {
  BaseEntityService,
  dateTime,
  EntityStateProvider,
  PagedEntityState,
  TenantedEntity,
} from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface StorePos extends TenantedEntity {
  storeId: string;
  posId: string;
  startDate: string;
  endDate: string;
}

export type StorePosState = PagedEntityState<StorePos>;

class StorePosService extends BaseEntityService<StorePos> {
  constructor() {
    super({
      baseUrl: `${API_URL}/store_pos`,
    });
  }
}
const storePosService = new StorePosService();
export { storePosService };

export const storePosStateProvider = new EntityStateProvider<StorePos>({
  entityService: storePosService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      storeId: '',
      posId: '',
      startDate: dateTime().format('YYYY-MM-DD'),
      endDate: '',
    },
  },
  stateKey: 'store-pos',
});

export const storePosColumns = [
  {
    dataField: 'storeId',
    text: 'Store ID',
    sort: true,
  },
  {
    dataField: 'posId',
    text: 'POS ID',
    sort: true,
  },
  {
    dataField: 'startDate',
    text: 'Start Date',
    sort: true,
  },
  {
    dataField: 'endDate',
    text: 'End Date',
    sort: true,
  },
];
