import { BaseEntityService, EntityStateProvider, TenantedEntity, UnpagedEntityState } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface QAIQuestion extends TenantedEntity {
  text: string;
  notes: string;
  points: number;
  order: number;
  categoryId: string;
  tags: string;
}

export interface QAIGuestQuestion extends TenantedEntity {
  text: string;
  points: number;
  order: number;
}

export interface QAAScore extends TenantedEntity {
  name: string;
  order: number;
  requireStaffAttendance: boolean;
  questions: QAIQuestion[];
  guestQuestions: QAIGuestQuestion[];
}

export type QAAScoreState = UnpagedEntityState<QAAScore>;

class QAAScoreService extends BaseEntityService<QAAScore> {
  constructor() {
    super({
      baseUrl: `${API_URL}/qai/section`,
    });
  }
}
const qaaScoreService = new QAAScoreService();
export { qaaScoreService };

export const qaiSectionStateProvider = new EntityStateProvider<QAAScore>({
  entityService: qaaScoreService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      name: 'New QAA Score',
      order: 0,
      requireStaffAttendance: false,
      guestQuestions: [],
      questions: [],
    },
  },
  stateKey: 'qaaScoreState',
});
