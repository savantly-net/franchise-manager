import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import { FMOptionsReducer } from 'plugin/config/fmOptions';
import { addressBookStateProvider } from 'plugin/pages/AddressBook/entity';
import { calendarStateProvider } from 'plugin/pages/Calendar/entity';
import { knowledgesStateProvider } from 'plugin/pages/Knowledge/entity';
import { franchiseFeesStateProvider } from 'plugin/pages/Locations/Fees/feeEntity';
import { franchiseFeeTypesStateProvider } from 'plugin/pages/Locations/Fees/feeTypesEntity';
import { franchiseGroupsStateProvider } from 'plugin/pages/Locations/Groups/entity';
import { franchiseMarketStateProvider } from 'plugin/pages/Locations/Markets/entity';
import { franchiseOwnershipStateProvider } from 'plugin/pages/Locations/Owners/entity';
import { FranchiseLocationsReducer } from 'plugin/pages/Locations/state/reducers';
import { storePosStateProvider } from 'plugin/pages/Locations/StorePos/entity';
import { newsletterStateProvider } from 'plugin/pages/Newsletter/entityConfig';
import { qaiQuestionCategoryStateProvider } from 'plugin/pages/Quality/categories/entity';
import { qaiSectionStateProvider } from 'plugin/pages/Quality/sections/entity';
import { qaiSubmissionStateProvider } from 'plugin/pages/Quality/submissions/entity';
import { storeVisitStateProvider } from 'plugin/pages/Quality/visits/entity';
import { reportSourceStateProvider } from 'plugin/pages/ReportManager/entityConfig';
import { IModule } from 'redux-dynamic-modules';
import { AppModuleRootState, AppModuleState } from '../types';

const combinedReducers = combineReducers({
  // declare reducers here
  addresses: addressBookStateProvider.slice.reducer,
  calendar: calendarStateProvider.slice.reducer,
  feeState: franchiseFeesStateProvider.slice.reducer,
  feeTypeState: franchiseFeeTypesStateProvider.slice.reducer,
  franchiseLocationState: FranchiseLocationsReducer,
  fmSelectOptions: FMOptionsReducer,
  groupState: franchiseGroupsStateProvider.slice.reducer,
  knowledge: knowledgesStateProvider.slice.reducer,
  marketState: franchiseMarketStateProvider.slice.reducer,
  newsletter: newsletterStateProvider.slice.reducer,
  ownershipState: franchiseOwnershipStateProvider.slice.reducer,
  qaiQuestionCategories: qaiQuestionCategoryStateProvider.slice.reducer,
  qaiSections: qaiSectionStateProvider.slice.reducer,
  qaiSubmissions: qaiSubmissionStateProvider.slice.reducer,
  reportSources: reportSourceStateProvider.slice.reducer,
  storeVisits: storeVisitStateProvider.slice.reducer,
  storePosState: storePosStateProvider.slice.reducer,
});

function AppModuleStateReducer(state: AppModuleState | undefined, action: AnyAction): AppModuleState {
  return combinedReducers(state, action);
}

const AppStateModule: IModule<AppModuleRootState> = {
  id: 'franchise-manager',
  reducerMap: {
    franchiseManagerState: AppModuleStateReducer,
  },
};

export const getFormStateModule = () => AppStateModule;
