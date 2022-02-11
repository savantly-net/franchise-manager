import { dateTime } from '@savantly/sprout-api';
import { FranchiseFee } from './Fees/feeEntity';

export interface FranchiseBar {
  id: string;
  standalone: boolean;
  linearFeet: Number;
  beer: boolean;
  liquor: boolean;
}

export interface FranchisePatio {
  id: string;
  totalSquareFeet: Number;
}

export class FranchiseBuilding {
  totalSquareFeet: Number = 0;
  fohSquareFeet: Number = 0;
  bohSquareFeet: Number = 0;
  maxOccupancy: Number = 0;
  maxSeating: Number = 0;
  leaseSignDate = dateTime().format('YYYY-MM-DD');
}

export class HourInterval {
  start = '07:00';
  end = '23:00';
}

export interface DateInterval {
  id: string;
  start: Date;
  end: Date;
}

export class FranchiseDayHours {
  isClosed = false;
  openIntervals: HourInterval[] = [];
}

export class FranchiseHoursOfOperation {
  sunday: FranchiseDayHours = new FranchiseDayHours();
  monday: FranchiseDayHours = new FranchiseDayHours();
  tuesday: FranchiseDayHours = new FranchiseDayHours();
  wednesday: FranchiseDayHours = new FranchiseDayHours();
  thursday: FranchiseDayHours = new FranchiseDayHours();
  friday: FranchiseDayHours = new FranchiseDayHours();
  saturday: FranchiseDayHours = new FranchiseDayHours();
}

export interface FranchiseHoursOfOperationModifier {
  id: string;
  dateToModify: Date;
  openTime: Date;
  closeTime: Date;
}

export interface FranchiseLocationMember {
  itemId?: string;
  userId?: string;
  locationId?: string;
  role: 'COACH' | 'STAFF' | 'OWNER';
}

export class FranchiseLocation {
  id = '';
  // @Size(max = 100)
  name = '';
  // @Size(max = 100)
  country = '';
  // @Size(max = 100)
  address1 = '';
  // @Size(max = 100)
  address2 = '';
  // @Size(max = 100)
  city = '';
  // @Size(max = 100)
  state = '';
  // @Size(max = 20)
  zip = '';
  concept = 'TRADITIONAL';
  locationType = 'STANDALONE';
  // @Size(max = 100)
  smallWare = '';
  kes = '';
  realEstateType = '';
  stage = '';
  distributionCenter = '';
  training = '';
  marketId = '';
  phoneNumber: Number = 0;
  bars: FranchiseBar[] = [];
  patios: FranchisePatio[] = [];
  building: FranchiseBuilding = new FranchiseBuilding();
  hours: FranchiseHoursOfOperation = new FranchiseHoursOfOperation();
  modifiedHours: FranchiseHoursOfOperationModifier[] = [];
  members: FranchiseLocationMember[] = [];
  fees: FranchiseFee[] = [];
  dateOpened: string = dateTime().format('YYYY-MM-DD');
  dateClosed?: string;
  openDateIntervals: DateInterval[] = [];
}

export interface FranchiseLocationState {
  locations: FranchiseLocation[];
  isFetching: boolean;
  isFetched: boolean;
  error?: string;
}
