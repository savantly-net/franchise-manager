import { BaseEntityService, EntityStateProvider, PagedEntityState, TenantedEntity } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface QAQuestionCategory extends TenantedEntity {
  name: string;
}

export type QAQuestionCategoryState = PagedEntityState<QAQuestionCategory>;

class QAQuestionCategoryService extends BaseEntityService<QAQuestionCategory> {
  constructor() {
    super({
      baseUrl: `${API_URL}/qai/question/category`,
    });
  }
}
const qaQuestionCategoryService = new QAQuestionCategoryService();
export { qaQuestionCategoryService };

export const qaQuestionCategoryStateProvider = new EntityStateProvider<QAQuestionCategory>({
  entityService: qaQuestionCategoryService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      name: 'New Question Category',
    },
  },
  stateKey: 'franchise-question-category',
});
