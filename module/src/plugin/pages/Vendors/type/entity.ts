import { BaseEntityService, EntityStateProvider, PagedEntityState, TenantedEntity } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface VendorType extends TenantedEntity {
  name: string;
}

export type VendorTypeState = PagedEntityState<VendorType>;

class VendorTypeService extends BaseEntityService<VendorType> {
  constructor() {
    super({
      baseUrl: `${API_URL}/vendor-type`,
    });
  }
}
const vendorTypeService = new VendorTypeService();
export { vendorTypeService };

export const vendorTypeStateProvider = new EntityStateProvider<VendorType>({
  entityService: vendorTypeService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      name: 'New Vendor Type',
    },
  },
  stateKey: 'franchise-vendor-type',
});
