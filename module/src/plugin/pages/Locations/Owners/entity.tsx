import {
  BaseEntityService,
  dateTime,
  EntityStateProvider,
  PagedEntityState,
  TenantedEntity,
} from '@savantly/sprout-api';
import { ColumnDescription } from '@sprout-platform/ui';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import { sortByKey } from 'plugin/services/arrays';
import React, { Fragment } from 'react';
import { FranchiseGroup } from '../Groups/entity';
import { FranchiseLocation } from '../types';

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

export const franchiseOwnershipColumns = (
  locations: FranchiseLocation[],
  groups: FranchiseGroup[]
): Array<ColumnDescription<FranchiseOwnership>> => {
  return [
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
      sort: true,
      formatter: (cell, row) => {
        console.log(`formatting locationId: ${cell}`);
        console.log(locations);
        const location = locations.find(l => l.id === cell);
        return <Fragment>{location?.name}</Fragment>;
      },
      sortFunc: (a, b, order) => {
        const locationA = locations.find(l => l.id === a);
        const locationB = locations.find(l => l.id === b);
        return sortByKey('name')(locationA, locationB, order);
      },
    },
    {
      dataField: 'groupId',
      text: 'Group',
      sort: true,
      formatter: (cell, row) => {
        console.log(`formatting groupId: ${cell}`);
        console.log(groups);
        const group = groups.find(l => l.id?.itemId === cell);
        return <Fragment>{group?.name}</Fragment>;
      },
      sortFunc: (a, b, order) => {
        const groupA = groups.find(l => l.id?.itemId === a);
        const groupB = groups.find(l => l.id?.itemId === b);
        return sortByKey('name')(groupA, groupB, order);
      },
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
};
