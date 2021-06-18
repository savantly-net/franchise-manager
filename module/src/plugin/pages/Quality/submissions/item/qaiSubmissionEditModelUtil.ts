import { QAIQuestionCategory } from '../../categories/entity';
import { QAIGuestQuestion, QAIQuestion, QAISection } from '../../sections/entity';
import {
  QAIGuestQuestionAnswerEditModel,
  QAIGuestQuestionAnswerGroup,
  QAIGuestQuestionAnswerGroupEditModel,
  QAIQuestionAnswer,
  QAISectionSubmission,
  QAISectionSubmissionEditModel,
} from '../entity';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const getCategoryName = (questionCategories: QAIQuestionCategory[], itemId: string) => {
  const found = questionCategories.filter(c => c.itemId === itemId);
  if (found && found.length > 0) {
    return found[0].name;
  } else {
    return 'Unknown Category';
  }
};

const getQuestionGroups = (section: QAISection) => {
  const groups: {
    [category: string]: QAIQuestion[];
  } = {};
  section.questions.forEach(q => {
    if (!Object.keys(groups).some(v => v === q.categoryId)) {
      groups[q.categoryId] = [];
    }
    groups[q.categoryId].push(q);
  });
  return groups;
};

export const updateQaiSubmissionEditModel = ({
  entity,
  section,
  questionCategories,
}: {
  entity: QAISectionSubmission;
  section: QAISection;
  questionCategories: QAIQuestionCategory[];
}): QAISectionSubmissionEditModel => {
  if (!entity.locationId || !entity.sectionId || !entity.itemId) {
    throw new Error('invalid QAI Submission');
  }

  const questionGroups = getQuestionGroups(section);

  const getQuestionAnswer = (questionId?: string) => {
    const found = entity.answers.filter(a => a.questionId === questionId);
    if (found && found.length > 0) {
      return found[0];
    }
    return undefined;
  };

  const getGuestQuestionAnswers = (
    ga: QAIGuestQuestionAnswerGroup,
    models: QAIGuestQuestion[]
  ): QAIGuestQuestionAnswerEditModel[] => {
    const result: QAIGuestQuestionAnswerEditModel[] = [];
    models.forEach(m => {
      const found = ga.answers.filter(a => a.guestQuestionId === m.itemId);
      if (found && found.length > 0) {
        const selected = found[0];
        result.push({
          order: m.order,
          points: m.points,
          questionText: m.text,
          guestQuestionId: selected.guestQuestionId,
          itemId: selected.itemId,
          value: selected.value,
        });
      }
    });
    return result;
  };

  const scaffoldGuestQuestionAnswerGroups = (
    guestAnswers: QAIGuestQuestionAnswerGroup[]
  ): QAIGuestQuestionAnswerGroupEditModel[] => {
    const result: QAIGuestQuestionAnswerGroupEditModel[] = [];

    const guestQuestionGroupModels: QAIGuestQuestion[] = section.guestQuestions;

    guestAnswers.forEach(ga => {
      result.push({
        itemId: ga.itemId,
        attachments: ga.attachments,
        notes: ga.notes,
        answers: getGuestQuestionAnswers(ga, guestQuestionGroupModels),
      });
    });
    return result;
  };

  return {
    itemId: entity.itemId,
    sectionId: section.itemId,
    locationId: entity.locationId,
    managerOnDuty: entity.managerOnDuty,
    answerGroups: Object.keys(questionGroups).map((g: string) => ({
      answers: questionGroups[g].map(q => ({
        questionId: q.itemId,
        questionText: q.text,
        points: q.points,
        order: q.order,
        attachments: getQuestionAnswer(q.itemId)?.attachments || [],
        value: getQuestionAnswer(q.itemId)?.value,
        notes: getQuestionAnswer(q.itemId)?.notes,
      })),
      groupName: getCategoryName(questionCategories, g),
    })),
    guestAnswerGroups: scaffoldGuestQuestionAnswerGroups(entity.guestAnswers),
  };
};

export const createQaiSubmissionEditModel = ({
  locationId,
  section,
  questionCategories,
}: {
  locationId: string;
  section: QAISection;
  questionCategories: QAIQuestionCategory[];
}): QAISectionSubmissionEditModel => {
  const questionGroups = getQuestionGroups(section);

  const scaffoldGuestQuestionAnswerGroup = (
    guestQuestions: QAIGuestQuestion[]
  ): QAIGuestQuestionAnswerGroupEditModel => {
    const answers: QAIGuestQuestionAnswerEditModel[] = guestQuestions.map(q => {
      return {
        guestQuestionId: q.itemId,
        order: q.order,
        points: q.points,
        questionText: q.text,
      };
    });
    return {
      answers,
      attachments: [],
    };
  };
  if (!section.itemId) {
    throw new Error('The section does not have an itemId');
  }

  return {
    itemId: uuidv4(),
    sectionId: section.itemId,
    locationId: locationId,
    answerGroups: Object.keys(questionGroups).map((g: string) => ({
      answers: questionGroups[g].map(q => ({
        questionId: q.itemId,
        questionText: q.text,
        points: q.points,
        order: q.order,
        attachments: [],
      })),
      groupName: getCategoryName(questionCategories, g),
    })),
    guestAnswerGroups: [scaffoldGuestQuestionAnswerGroup(section.guestQuestions)],
  };
};

export const convertQAISubmissionEditModel = (model: QAISectionSubmissionEditModel): QAISectionSubmission => {
  return {
    itemId: model.itemId,
    managerOnDuty: model.managerOnDuty,
    sectionId: model.sectionId,
    locationId: model.locationId,
    staffAttendance: model.staffAttendance,
    status: model.status,
    answers: model.answerGroups.flatMap(g => {
      return g.answers.map(a => {
        const answer: QAIQuestionAnswer = {
          itemId: a.itemId,
          notes: a.notes,
          questionId: a.questionId,
          value: a.value,
          attachments: a.attachments,
        };
        return answer;
      });
    }),
    guestAnswers: model.guestAnswerGroups,
  };
};
