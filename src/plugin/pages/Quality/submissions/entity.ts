import { BaseEntityService, EntityStateProvider, PagedEntityState, TenantedEntity } from '@savantly/sprout-api';
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
export interface QAIGuestQuestionAnswerEditModel extends QAIGuestQuestionAnswer {
  questionText: string;
  points: number;
  order: number;
}

export interface QAIGuestQuestionAnswerGroup {
  itemId?: string;
  answers: QAIGuestQuestionAnswer[];
  notes?: string;
  attachments: FileItem[];
}

export interface QAIGuestQuestionAnswerGroupEditModel {
  itemId?: string;
  answers: QAIGuestQuestionAnswerEditModel[];
  notes?: string;
  attachments: FileItem[];
}

export interface QAIQuestionAnswer {
  itemId?: string;
  questionId?: string;
  value?: QAIQuestionAnswerType;
  notes?: string;
  attachments: FileItem[];
}
export interface QAIQuestionAnswerEditModel extends QAIQuestionAnswer {
  questionText: string;
  points: number;
  order: number;
}

export interface QAISectionSubmission extends TenantedEntity {
  locationId?: string;
  sectionId?: string;
  managerOnDuty?: string;
  dateScored?: string;
  status?: QAISubmissionStatus;
  staffAttendance?: { [key: string]: string };
  answers: QAIQuestionAnswer[];
  guestAnswers: QAIGuestQuestionAnswerGroup[];
}

export interface QAIQuestionAnswerGroupEditModel {
  groupName: string;
  answers: QAIQuestionAnswerEditModel[];
}

export interface QAISectionSubmissionEditModel {
  itemId: string;
  sectionId?: string;
  locationId: string;
  managerOnDuty?: string;
  dateScored?: string;
  status?: QAISubmissionStatus;
  staffAttendance?: { [key: string]: string };
  answerGroups: QAIQuestionAnswerGroupEditModel[];
  guestAnswerGroups: QAIGuestQuestionAnswerGroupEditModel[];
}

export type QAISectionSubmissionState = PagedEntityState<QAISectionSubmission>;

class QAISectionSubmissionService extends BaseEntityService<QAISectionSubmission> {
  constructor() {
    super({
      baseUrl: `${API_URL}/qai/submission`,
    });
  }

  findByLocation = (locationId: string) => {
    return axios.get<QAISectionSubmission[]>(`${API_URL}/qai/submission/findByLocation/${locationId}`);
  };
}
const qaiSubmissionService = new QAISectionSubmissionService();
export { qaiSubmissionService };

export const qaiSubmissionStateProvider = new EntityStateProvider<QAISectionSubmission>({
  entityService: qaiSubmissionService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      answers: [],
      guestAnswers: [],
    },
  },
  stateKey: 'qaiSubmissionState',
});
