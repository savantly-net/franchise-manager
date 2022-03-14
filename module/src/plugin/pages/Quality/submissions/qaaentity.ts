import {
  BaseEntityService,
  EntityStateProvider,
  PagedEntityState,
  TenantedEntity,
  dateTime,
  UnpagedEntityState,
} from '@savantly/sprout-api';
import axios from 'axios';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import { FileItem } from 'plugin/types';
export type QAISubmissionStatus = 'DRAFT' | 'FINAL';

export type QAIGuestQuestionAnswerType = 'YES' | 'NO';
export type QAIQuestionAnswerType = 'YES' | 'NO' | 'NA';

export interface QAIGuestQuestionAnswer {
  itemId?: string;
  guestQuestionId?: string;
  value?: QAIQuestionAnswerType;
}
/**
 * For Answers
 */
export interface AnswerEditModel extends QAIGuestQuestionAnswer {
  questionId?: string;
  questionText?: string;
  notes?: string;
  points?: number;
  order?: number;
  itemId?: string;
  attachments: FileItem[];
}

export interface QAIGuestQuestionAnswerGroup {
  itemId: string;
  answers: QAIGuestQuestionAnswer[];
  notes: string;
  attachments: FileItem[];
}
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
export interface QAIQuestionAnswer {
  itemId?: string;
  questionId?: string;
  value?: QAIQuestionAnswerType;
  notes?: string;
  attachments: FileItem[];
}

/**
 * For sections
 */
export interface QAASection {
  itemId?: string;
  sectionId?: string;
  locationId?: string;
  dateScored?: string;
  status?: string;
  answers: AnswerEditModel[];
  guestAnswers: QAIGuestQuestionAnswerGroup[];
}

export interface QAASectionSubmission extends TenantedEntity {
  itemId: string;
  locationId?: string;
  sectionId?: string;
  managerOnDuty?: string;
  dateScored?: string;
  status?: QAISubmissionStatus;
  staffAttendance?: { [key: string]: string };
  fsc?: string;
  fsm?: string;
  responsibleAlcoholCert?: string;
  sections: QAASection[];
}

export type QAASectionSubmissionState = PagedEntityState<QAASectionSubmission>;

class QAASectionSubmissionService extends BaseEntityService<QAASectionSubmission> {
  constructor() {
    super({
      baseUrl: `${API_URL}/qaa/submission`,
    });
  }

  findByLocation = (locationId: string) => {
    return axios.get<QAASectionSubmission[]>(`${API_URL}/qai/submission/findByLocation/${locationId}`);
  };
}
const qaaSubmissionService = new QAASectionSubmissionService();
export { qaaSubmissionService };

export const qaaSubmissionStateProvider = new EntityStateProvider<QAASectionSubmission>({
  entityService: qaaSubmissionService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      itemId: '',
      sections: [],
      // answers: [],
      // guestAnswers: [],
      dateScored: dateTime().format('YYYY-MM-DDTHH:mm:ssZ'),
    },
  },
  stateKey: 'qaiSubmissionState',
});
