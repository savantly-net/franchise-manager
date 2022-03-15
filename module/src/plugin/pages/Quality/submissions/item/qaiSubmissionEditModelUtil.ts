import { QAIQuestionCategory } from '../../categories/entity';
import { QAIQuestion, QAISection } from '../../sections/entity';
import { QAISectionSubmission, QAISectionSubmissionEditModel } from '../entity';

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
        attachments: [],
      })),
      groupName: getCategoryName(questionCategories, g),
    })),
    guestAnswerGroups: [],
  };
};

export const createQaiSubmissionEditModel = ({
  locationId,
  sections,
  questionCategories,
}: {
  locationId: string;
  sections: QAISection;
  questionCategories: QAIQuestionCategory[];
}): QAISectionSubmissionEditModel => {
  const questionGroups = getQuestionGroups(sections);

  return {
    itemId: uuidv4(),
    sectionId: sections.itemId,
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
    guestAnswerGroups: [],
  };
};
