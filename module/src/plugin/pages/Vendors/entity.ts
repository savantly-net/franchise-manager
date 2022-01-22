import { BaseEntityService, EntityStateProvider, PagedEntityState, TenantedEntity } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface FranchiseVendor extends TenantedEntity {
  name: string;
  phoneNumber: string;
  emailAddress: string;
  mailingAddress: string;
  notes: string;
  typeId: string;
}

export type FranchiseVendorState = PagedEntityState<FranchiseVendor>;

class VendorService extends BaseEntityService<FranchiseVendor> {
  constructor() {
    super({
      baseUrl: `${API_URL}/vendor`,
    });
  }
}
const vendorService = new VendorService();
export { vendorService };

export const franchiseVendorStateProvider = new EntityStateProvider<FranchiseVendor>({
  entityService: vendorService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      name: 'New Vendor',
      phoneNumber: '',
      emailAddress: '',
      mailingAddress: '',
      notes: '',
      typeId: '',
    },
  },
  stateKey: 'franchise-vendors',
});

export const franchiseVendorColumns = [
  {
    dataField: 'name',
    text: 'Name',
    sort: true,
  },
  {
    dataField: 'phoneNumber',
    text: 'Phone Number',
  },
  {
    dataField: 'emailAddress',
    text: 'Email',
  },
  {
    dataField: 'mailingAddress',
    text: 'Mail Address',
    sort: true,
  },
  {
    dataField: 'notes',
    text: 'Notes',
    sort: true,
  },
  {
    dataField: 'typeId',
    text: 'Type',
    sort: true,
  },
];
