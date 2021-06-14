import { getApiService } from '@savantly/sprout-runtime';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import { FranchiseFee } from './Fees/feeEntity';
import { FranchiseLocation, FranchiseLocationMember } from './types';

export const locationService = {
  getLocations: () => {
    return getApiService().get<FranchiseLocation[]>(`${API_URL}/locations`);
  },
  createLocation: (location: FranchiseLocation) => {
    return getApiService().post(`${API_URL}/locations`, location);
  },
  updateLocation: (location: FranchiseLocation) => {
    return getApiService().post(`${API_URL}/locations/${location.id}`, location);
  },
  getLocationByItemId: (itemId: string) => {
    return getApiService().get<FranchiseLocation>(`${API_URL}/locations/${itemId}`);
  },
  getLocationMembers: (itemId: string) => {
    return getApiService().get<FranchiseLocationMember[]>(`${API_URL}/locations/${itemId}/members`);
  },
  updateLocationMembers: (itemId: string, members: FranchiseLocationMember[]) => {
    return getApiService().put<FranchiseLocationMember[]>(`${API_URL}/locations/${itemId}/members`, members);
  },
  getLocationFees: (itemId: string) => {
    return getApiService().get<FranchiseFee[]>(`${API_URL}/locations/${itemId}/fees`);
  },
};
