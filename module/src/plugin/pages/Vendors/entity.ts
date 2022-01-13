import { BaseEntityService, EntityStateProvider, PagedEntityState, TenantedEntity } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import { VendorType } from './type/entity';

export interface FranchiseVendor extends TenantedEntity {
  name: string;
  phoneNumber: string;
  emailAddress: string;
  mailingAddress: string;
  notes: string;
  typeId: string;
  type: VendorType[];
}

export type FranchiseVendorState = PagedEntityState<FranchiseVendor>;

class VendorService extends BaseEntityService<FranchiseVendor> {
  constructor() {
    super({
      baseUrl: `${API_URL}/groups`,
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
      type: [],
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
    dataField: 'address1',
    text: 'Phone Number',
  },
  {
    dataField: 'address2',
    text: 'Email',
  },
  {
    dataField: 'city',
    text: 'Mail Address',
    sort: true,
  },
  {
    dataField: 'state',
    text: 'Notes',
    sort: true,
  },
  {
    dataField: 'zip',
    text: 'Type',
    sort: true,
  },
];
