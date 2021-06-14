import { BaseEntityService, EntityStateProvider, PagedEntityState, TenantedEntity } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface QAIQuestionCategory extends TenantedEntity {
  name: string;
}

export type QAIQuestionCategoryState = PagedEntityState<QAIQuestionCategory>;

class QAIQuestionCategoryService extends BaseEntityService<QAIQuestionCategory> {
  constructor() {
    super({
      baseUrl: `${API_URL}/qai/question/category`,
    });
  }
}
const qaiQuestionCategoryService = new QAIQuestionCategoryService();
export { qaiQuestionCategoryService };

export const qaiQuestionCategoryStateProvider = new EntityStateProvider<QAIQuestionCategory>({
  entityService: qaiQuestionCategoryService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      name: 'New Question Category',
    },
  },
  stateKey: 'franchise-question-category',
});
