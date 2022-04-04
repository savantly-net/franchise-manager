import { BaseEntityService, EntityStateProvider, TenantedEntity, UnpagedEntityState } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface QAQuestion extends TenantedEntity {
  itemId: string;
  sectionId: string;
  categoryId: string;
  tags: string;
  order: number;
  text: string;
  points: number;
}

export interface QAGuestQuestion extends TenantedEntity {
  sectionId: string;
  order: number;
  text: string;
  points: number;
}

export interface QASection extends TenantedEntity {
  name: string;
  order: number;
  requireStaffAttendance: boolean;
  questions: QAQuestion[];
  guestQuestions: QAGuestQuestion[];
}

export type QASectionState = UnpagedEntityState<QASection>;

class QASectionService extends BaseEntityService<QASection> {
  constructor() {
    super({
      baseUrl: `${API_URL}/qai/section`,
    });
  }
}
const qaSectionService = new QASectionService();
export { qaSectionService };

export const qaSectionStateProvider = new EntityStateProvider<QASection>({
  entityService: qaSectionService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      name: 'New QA Section',
      order: 0,
      requireStaffAttendance: false,
      guestQuestions: [],
      questions: [],
    },
  },
  stateKey: 'qaSectionState',
});
