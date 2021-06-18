import { BaseEntityService, dateTime, EntityState, EntityStateProvider, TenantedEntity } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface Newsletter extends TenantedEntity {
  title: string;
  text: string;
  tags: string[];
}

export type NewsletterState = EntityState<Newsletter>;

class NewsletterService extends BaseEntityService<Newsletter> {
  constructor() {
    super({
      baseUrl: `${API_URL}/newsletter`,
    });
  }
}
const newsletterService = new NewsletterService();
export { newsletterService };

export const newsletterStateProvider = new EntityStateProvider<Newsletter>({
  entityService: newsletterService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      title: dateTime().format('YYYY-MM-DD'),
      text: "## What's new...",
      tags: [],
    },
  },
  stateKey: 'newsletter',
});
