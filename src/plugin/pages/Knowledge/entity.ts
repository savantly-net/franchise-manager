import { BaseEntityService, EntityState, EntityStateProvider, TenantedEntity } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface Knowledge extends TenantedEntity {
  title: string;
  text: string;
  tags: string[];
}

export type KnowledgeState = EntityState<Knowledge>;

class KnowledgeService extends BaseEntityService<Knowledge> {
  constructor() {
    super({
      baseUrl: `${API_URL}/knowledge`,
    });
  }
}
const knowledgeService = new KnowledgeService();
export { knowledgeService };

export const knowledgesStateProvider = new EntityStateProvider<Knowledge>({
  entityService: knowledgeService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      title: 'New Knowledge',
      text: '# New Knowledge',
      tags: [],
    },
  },
  stateKey: 'knowledge',
});
