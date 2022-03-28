import { BaseEntityService, EntityStateProvider, TenantedEntity, UnpagedEntityState } from '@savantly/sprout-api';
import { getApiService } from '@savantly/sprout-runtime';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface QAAcategoryScore extends TenantedEntity {
  categoryName: string;
  sectionOrder: number;
  available: number;
  na: number;
  required: number;
  score: number;
  rating: number;
}

export interface QAASectionScore extends TenantedEntity {
  sectionId: string;
  sectionName: string;
  order: number;
  categoryScores: QAAcategoryScore[];
}

export interface QAAScoresByTag extends TenantedEntity {
  tag: string;
  available: number;
  na: number;
  required: number;
  score: number;
  rating: number;
}

export interface QAASubmissionScore extends TenantedEntity {
  submissionId: string;
  overallAvailable: number;
  overallNA: number;
  overallRequired: number;
  overallScore: number;
  overallRating: number;
  sections: QAASectionScore[];
  scoresByTag: QAAScoresByTag[];
}

export type QAAScoreState = UnpagedEntityState<QAASubmissionScore>;

class QAAScoreService extends BaseEntityService<QAASubmissionScore> {
  constructor() {
    super({
      baseUrl: `${API_URL}/qaa/submission`,
    });
  }
}
const qaaScoreService = new QAAScoreService();
export { qaaScoreService };

export const qaaScoreStateProvider = new EntityStateProvider<QAASubmissionScore>({
  entityService: qaaScoreService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      submissionId: '',
      overallAvailable: 0,
      overallNA: 0,
      overallRequired: 0,
      overallScore: 0,
      overallRating: 0,
      sections: [],
      scoresByTag: [],
    },
  },
  stateKey: 'qaaScoreState',
});

export const QAASubmScoreService = {
  getQAAScore: (submId: string) => {
    return getApiService().get<QAASubmissionScore[]>(`${API_URL}/qaa/submission/${submId}/score`);
  },
};
