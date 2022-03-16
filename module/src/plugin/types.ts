import { AppPluginMeta, PluginConfigPageProps } from '@savantly/sprout-api';
import { FMSelectOptions } from './config/fmOptions';
import { AddressBookEntryState } from './pages/AddressBook/entity';
import { CalendarState } from './pages/Calendar/entity';
import { KnowledgeState } from './pages/Knowledge/entity';
import { FranchiseFeeState } from './pages/Locations/Fees/feeEntity';
import { FranchiseFeeTypeState } from './pages/Locations/Fees/feeTypesEntity';
import { FranchiseGroupState } from './pages/Locations/Groups/entity';
import { FranchiseVendorState } from './pages/Vendors/entity';
import { VendorTypeState } from './pages/Vendors/type/entity';
import { FranchiseMarketState } from './pages/Locations/Market/entity';
import { FranchiseOwnershipState } from './pages/Locations/Owners/entity';
import { StorePosState } from './pages/Locations/StorePos/entity';
import { FranchiseLocationState } from './pages/Locations/types';
import { NewsletterState } from './pages/Newsletter/entityConfig';
import { QAIQuestionCategoryState } from './pages/Quality/categories/entity';
import { QAISectionState } from './pages/Quality/sections/entity';
import { QAISectionSubmissionState } from './pages/Quality/submissions/entity';
// import { QAASectionSubmissionState } from './pages/Quality/submissions/qaaentity';
import { StoreVisitState } from './pages/Quality/visit/entity';
import { ReportSourceState } from './pages/ReportManager/entityConfig';

export interface AppPluginSettings {
  storeVisitFormId?: string;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface AppModuleState {
  // declare plugin custom state fields here
  franchiseLocationState: FranchiseLocationState;
  fmSelectOptions: FMSelectOptions;
  marketState: FranchiseMarketState;
  groupState: FranchiseGroupState;
  vendorState: FranchiseVendorState;
  vendorTypeState: VendorTypeState;
  feeTypeState: FranchiseFeeTypeState;
  feeState: FranchiseFeeState;
  knowledge: KnowledgeState;
  newsletter: NewsletterState;
  calendar: CalendarState;
  addresses: AddressBookEntryState;
  ownershipState: FranchiseOwnershipState;
  qaiSections: QAISectionState;
  qaiQuestionCategories: QAIQuestionCategoryState;
  qaiSubmissions: QAISectionSubmissionState;
  // qaaSubmissions: QAASectionSubmissionState;
  reportSources: ReportSourceState;
  storeVisits: StoreVisitState;
  storePosState: StorePosState;
}

export interface AppModuleRootState {
  franchiseManagerState: AppModuleState;
}

export interface FileItem {
  id: string;
  name: string;
  downloadUrl: string;
  contentType: string;
}
export type ConfigPageProps = PluginConfigPageProps<AppPluginMeta<AppPluginSettings>>;
