import { BaseEntityService, EntityStateProvider, PagedEntityState, TenantedEntity } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface FranchiseGroupMember {
  itemId?: string;
  userId?: string;
  locationId?: string;
  role: 'COACH' | 'STAFF' | 'OWNER';
}

export interface FranchiseGroup extends TenantedEntity {
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  members: FranchiseGroupMember[];
}

export type FranchiseGroupState = PagedEntityState<FranchiseGroup>;

class GroupService extends BaseEntityService<FranchiseGroup> {
  constructor() {
    super({
      baseUrl: `${API_URL}/groups`,
    });
  }
}
const groupService = new GroupService();
export { groupService };

export const franchiseGroupsStateProvider = new EntityStateProvider<FranchiseGroup>({
  entityService: groupService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      name: 'New Group',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      members: [],
    },
  },
  stateKey: 'franchise-groups',
});

export const franchiseGroupColumns = [
  {
    dataField: 'name',
    text: 'Name',
    sort: true,
  },
  {
    dataField: 'address1',
    text: 'Address',
  },
  {
    dataField: 'address2',
    text: 'Ste',
  },
  {
    dataField: 'city',
    text: 'City',
    sort: true,
  },
  {
    dataField: 'state',
    text: 'State',
    sort: true,
  },
  {
    dataField: 'zip',
    text: 'Zip',
    sort: true,
  },
];
