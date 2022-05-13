import {
  BaseEntityService,
  dateTime,
  EntityStateProvider,
  PagedEntityState,
  TenantedEntity,
} from '@savantly/sprout-api';
import { getApiService } from '@savantly/sprout-runtime';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import { FileItem } from 'plugin/types';
import { uuidv4 } from '../../../config/id';
import { QAQuestionCategory } from '../categories/entity';
import { QAGuestQuestion, QASection } from '../sections/entity';

export type QAGuestQuestionAnswerType = 'YES' | 'NO' | 'NA';
export type QAQuestionAnswerType = 'YES' | 'NO' | 'NA';
export type QASubmissionStatus = 'DRAFT' | 'FINAL';

export interface QASubmission {
  id: string;
  locationId?: string;
  dateScored?: string;
  managerOnDuty?: string;
  fsc?: string;
  fsm?: string;
  responsibleAlcoholCert?: string;
  startTime?: string;
  endTime?: string;
  sections: QASectionSubmission[];
}

export interface QASectionSubmission extends TenantedEntity {
  locationId?: string;
  sectionId?: string;
  managerOnDuty?: string;
  dateScored?: string;
  status?: string;
  staffAttendance?: { [key: string]: string };
  answers: QAQuestionAnswer[];
  guestAnswers: QAGuestQuestionAnswerGroup[];
  order: number;
}

export interface QAQuestionAnswer {
  itemId: string;
  questionId?: string;
  value?: QAQuestionAnswerType;
  notes?: string;
  attachments: FileItem[];
}

export interface QAGuestQuestionAnswerGroup {
  itemId?: string;
  answers: QAGuestQuestionAnswer[];
  notes?: string;
  attachments: FileItem[];
}

export interface QAGuestQuestionAnswer {
  itemId?: string;
  guestQuestionId?: string;
  value?: QAQuestionAnswerType;
}

/**
 * QAA SCORE
 */

export interface QAcategoryScore extends TenantedEntity {
  categoryName: string;
  sectionOrder: number;
  available: number;
  na: number;
  required: number;
  score: number;
  rating: number;
}

export interface QASectionScore extends TenantedEntity {
  sectionId: string;
  sectionName: string;
  order: number;
  rating: number;
  categoryScores: QAcategoryScore[];
}

export interface QAAScoresByTag extends TenantedEntity {
  tag: string;
  available: number;
  na: number;
  required: number;
  score: number;
  rating: number;
}

export interface QASubmissionScore extends TenantedEntity {
  submissionId: string;
  overallAvailable: number;
  overallNA: number;
  overallRequired: number;
  overallScore: number;
  overallRating: number;
  sections: QASectionScore[];
  scoresByTag: QAAScoresByTag[];
}

/**
 * QAA Service/state
 */
export type QASubmissionState = PagedEntityState<QASubmission>;

class QASubmissionService extends BaseEntityService<QASubmission> {
  constructor() {
    super({
      baseUrl: `${API_URL}/qaa/submission`,
    });
  }

  findByLocation = (locationId: string) => {
    return getApiService().get<QASectionSubmission[]>(`${API_URL}/qai/submission/findByLocation/${locationId}`);
  };

  getQAScore = (submId: string) => {
    return getApiService().get<QASubmissionScore>(`${API_URL}/qaa/submission/${submId}/score`);
  };

  deleteQASubmission = (submId: string) => {
    return getApiService().delete<QASubmission>(`${API_URL}/qaa/submission/${submId}`);
  };
}
const qaService = new QASubmissionService();
export { qaService };

export const qaSubmissionStateProvider = new EntityStateProvider<QASubmission>({
  entityService: qaService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      id: uuidv4(),
      sections: [],
      dateScored: dateTime().format('YYYY-MM-DD'),
    },
  },
  stateKey: 'qaSubmissionState',
});

export const generateEmptyQASubmission = (
  qaSections: QASection[],
  questionCategories: QAQuestionCategory[]
): QASubmission => {
  const submissionDefaults = qaSubmissionStateProvider.props.initialState.example;
  submissionDefaults.id = uuidv4();
  const qaSectionSubmissions: QASectionSubmission[] = [];
  qaSections.map(section => {
    const model: QASectionSubmission = {
      order: section.order,
      dateScored: dateTime().format('YYYY-MM-DD'),
      sectionId: section.itemId,
      answers: generateEmptyAnswers(section, questionCategories),
      guestAnswers: generateEmptyGuestAnswerGroups(section),
    };
    qaSectionSubmissions.push(model);
  });
  return {
    ...submissionDefaults,
    sections: qaSectionSubmissions,
  };
};

const generateEmptyAnswers = (section: QASection, questionCategories: QAQuestionCategory[]): QAQuestionAnswer[] => {
  const answers = section.questions.map(q => {
    const answer: QAQuestionAnswer = {
      itemId: uuidv4(),
      questionId: q.itemId,
      attachments: [],
    };
    return answer;
  });
  return answers;
};

const generateEmptyGuestAnswerGroups = (section: QASection): QAGuestQuestionAnswerGroup[] => {
  const answerGroups: QAGuestQuestionAnswerGroup[] = [];
  section.guestQuestions.map(q => {
    answerGroups.push({
      answers: generateEmptyGuestAnswers(q),
      notes: q.text,
      attachments: [],
    });
  });
  return answerGroups;
};

const generateEmptyGuestAnswers = (question: QAGuestQuestion): QAGuestQuestionAnswer[] => {
  const answers: QAGuestQuestionAnswer[] = [];
  for (let i = 0; i < 3; i++) {
    answers.push({
      guestQuestionId: question.itemId,
    });
  }
  return answers;
};
