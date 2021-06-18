import {
  BaseEntityService,
  EntityStateProvider,
  PagedEntityState,
  QueryResponse,
  TenantedEntity,
} from '@savantly/sprout-api';
import { AxiosResponse } from 'axios';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import { ColumnDescription } from 'react-bootstrap-table-next';

export interface FranchiseFeeType extends TenantedEntity {
  name: string;
  description?: string;
  recurring: boolean;
  recurringInterval?: 'MONTHLY' | 'DAILY';
  defaultAmount: Number;
  feeAmountType: 'DOLLAR' | 'PERCENTAGE';
  deleted?: boolean;
  enabled: boolean;
  assignmentType: 'STORE' | 'LOCATION';
}

export type FranchiseFeeTypeState = PagedEntityState<FranchiseFeeType>;

class FeeTypeService extends BaseEntityService<FranchiseFeeType> {
  constructor() {
    super({
      baseUrl: `${API_URL}/fee-types`,
    });
  }
  // Technically only returns the first 200
  getAll = () => {
    return this.load({
      params: {
        size: 200,
      },
    }) as Promise<AxiosResponse<QueryResponse<FranchiseFeeType>>>;
  };
}
const franchiseFeeTypeService = new FeeTypeService();
export { franchiseFeeTypeService };

export const franchiseFeeTypesStateProvider = new EntityStateProvider<FranchiseFeeType>({
  entityService: franchiseFeeTypeService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      name: 'New Fee Type',
      assignmentType: 'STORE',
      defaultAmount: 0,
      enabled: true,
      feeAmountType: 'DOLLAR',
      recurring: true,
    },
  },
  stateKey: 'franchise-fee-types',
});

export const franchiseFeeTypeColumns: ColumnDescription[] = [
  {
    dataField: 'name',
    text: 'Name',
    sort: true,
  },
  {
    dataField: 'description',
    text: 'Description',
  },
  {
    dataField: 'feeAmountType',
    text: 'Amount Type',
    sort: true,
  },
  {
    dataField: 'recurring',
    text: 'Recurring Fee',
    sort: true,
  },
  {
    dataField: 'recurringInterval',
    text: 'Interval',
    sort: true,
  },
  {
    dataField: 'defaultAmount',
    text: 'Default Amount',
    sort: true,
  },
  {
    dataField: 'enabled',
    text: 'Enabled',
    sort: true,
  },
  {
    dataField: 'assignmentType',
    text: 'Assignment Type',
    sort: true,
  },
];
