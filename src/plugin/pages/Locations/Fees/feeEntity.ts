import { BaseEntityService, dateTime, EntityState, EntityStateProvider, TenantedEntity } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import { ColumnDescription } from 'react-bootstrap-table-next';

export interface FranchiseFee extends TenantedEntity {
  locationId: string;
  feeTypeId: string;
  startDate: string;
  endDate?: string;
  overrideAmount?: number;
}

export type FranchiseFeeState = EntityState<FranchiseFee>;

class FeeService extends BaseEntityService<FranchiseFee> {
  constructor() {
    super({
      baseUrl: `${API_URL}/fees`,
    });
  }
}
const franchiseFeeService = new FeeService();
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

export const franchiseFeeColumns: ColumnDescription[] = [
  {
    dataField: 'locationId',
    text: 'location',
    sort: true,
  },
  {
    dataField: 'feeTypeId',
    text: 'Fee Type',
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
  {
    dataField: 'amount',
    text: 'Amount',
    sort: true,
  },
  {
    dataField: 'hasCustomAmount',
    text: 'Custom',
  },
];
