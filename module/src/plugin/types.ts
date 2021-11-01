import { AppPluginMeta, PluginConfigPageProps } from '@savantly/sprout-api';
import { FMSelectOptions } from './config/fmOptions';
import { AddressBookEntryState } from './pages/AddressBook/entity';
import { CalendarState } from './pages/Calendar/entity';
import { KnowledgeState } from './pages/Knowledge/entity';
import { FranchiseFeeState } from './pages/Locations/Fees/feeEntity';
import { FranchiseFeeTypeState } from './pages/Locations/Fees/feeTypesEntity';
import { FranchiseGroupState } from './pages/Locations/Groups/entity';
import { FranchiseMarketState } from './pages/Locations/Markets/entity';
import { FranchiseOwnershipState } from './pages/Locations/Owners/entity';
import { FranchiseLocationState } from './pages/Locations/types';
import { NewsletterState } from './pages/Newsletter/entityConfig';
import { QAIQuestionCategoryState } from './pages/Quality/categories/entity';
import { QAISectionState } from './pages/Quality/sections/entity';
import { QAISectionSubmissionState } from './pages/Quality/submissions/entity';
import { StoreVisitState } from './pages/Quality/visits/entity';
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
  reportSources: ReportSourceState;
  storeVisits: StoreVisitState;
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
