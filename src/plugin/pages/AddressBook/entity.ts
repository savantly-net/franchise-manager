import { BaseEntityService, EntityState, EntityStateProvider, TenantedEntity } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface AddressBookEntry extends TenantedEntity {
  attributes: { [key: string]: string };
}

export type AddressBookEntryState = EntityState<AddressBookEntry>;

class AddressBookEntryService extends BaseEntityService<AddressBookEntry> {
  constructor() {
    super({
      baseUrl: `${API_URL}/addressbook`,
    });
  }
}
const addressBookService = new AddressBookEntryService();
export { addressBookService };

export const addressBookStateProvider = new EntityStateProvider<AddressBookEntry>({
  entityService: addressBookService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      attributes: {
        name: '',
        phoneNumber: '',
        address: '',
      },
    },
  },
  stateKey: 'addresses',
});
