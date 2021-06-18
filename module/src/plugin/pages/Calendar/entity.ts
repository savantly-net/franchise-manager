import { BaseEntityService, dateTime, EntityState, EntityStateProvider, TenantedEntity } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface Calendar extends TenantedEntity {
  title: string;
  text: string;
  tags: string[];
  fromDate: string;
  toDate: string;
  allDay: boolean;
}

export type CalendarState = EntityState<Calendar>;

class CalendarService extends BaseEntityService<Calendar> {
  constructor() {
    super({
      baseUrl: `${API_URL}/calendar`,
    });
  }
}
const calendarService = new CalendarService();
export { calendarService };

export const calendarStateProvider = new EntityStateProvider<Calendar>({
  entityService: calendarService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      title: 'New Event',
      text: '## A new event...',
      tags: [],
      fromDate: dateTime().format('YYYY-MM-DDTHH:mm:ssZ'),
      toDate: dateTime().format('YYYY-MM-DDTHH:mm:ssZ'),
      allDay: false,
    },
  },
  stateKey: 'calendar',
});
