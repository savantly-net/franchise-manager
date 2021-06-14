import { BaseEntityService, EntityStateProvider, TenantedEntity, UnpagedEntityState } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface QAIQuestion extends TenantedEntity {
  text: string;
  points: number;
  order: number;
  categoryId: string;
}

export interface QAIGuestQuestion extends TenantedEntity {
  text: string;
  points: number;
  order: number;
}

export interface QAISection extends TenantedEntity {
  name: string;
  order: number;
  requireStaffAttendance: boolean;
  questions: QAIQuestion[];
  guestQuestions: QAIGuestQuestion[];
}

export type QAISectionState = UnpagedEntityState<QAISection>;

class QAISectionService extends BaseEntityService<QAISection> {
  constructor() {
    super({
      baseUrl: `${API_URL}/qai/section`,
    });
  }
}
const qaiSectionService = new QAISectionService();
export { qaiSectionService };

export const qaiSectionStateProvider = new EntityStateProvider<QAISection>({
  entityService: qaiSectionService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      name: 'New QAI Section',
      order: 0,
      requireStaffAttendance: false,
      guestQuestions: [],
      questions: [],
    },
  },
  stateKey: 'qaiSectionState',
});
