import { BaseEntityService, EntityStateProvider, PagedEntityState, TenantedEntity } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface FranchiseGroup extends TenantedEntity {
  name: string;
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
