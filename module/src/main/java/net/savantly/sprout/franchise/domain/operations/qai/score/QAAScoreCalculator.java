package net.savantly.sprout.franchise.domain.operations.qai.score;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.franchise.domain.operations.qai.audit.QAASubmission;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.QAIGuestQuestion;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.QAIGuestQuestionRepository;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answer.QAIGuestQuestionAnswerDto;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answer.QAIGuestQuestionAnswerType;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answerGroup.QAIGuestQuestionAnswerGroupDto;
import net.savantly.sprout.franchise.domain.operations.qai.question.QAIQuestion;
import net.savantly.sprout.franchise.domain.operations.qai.question.QAIQuestionRepository;
import net.savantly.sprout.franchise.domain.operations.qai.question.answer.QAIQuestionAnswerDto;
import net.savantly.sprout.franchise.domain.operations.qai.question.answer.QAIQuestionAnswerType;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategory;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategoryRepository;
import net.savantly.sprout.franchise.domain.operations.qai.section.QAISection;
import net.savantly.sprout.franchise.domain.operations.qai.section.QAISectionRepository;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISectionSubmissionDto;

@RequiredArgsConstructor
public class QAAScoreCalculator {
	
	private final String GUEST_CATEGORY = "GUEST";
	
	private final QAISectionRepository sectionRepo;
	private final QAIQuestionRepository questionRepo;
	private final QAIGuestQuestionRepository guestQuestionRepo;
	private final QAIQuestionCategoryRepository categoryRepo;

	public QAAScore createScoreFromSubmission(QAASubmission submission, List<QAISectionSubmissionDto> sectionSubmission) {
		QAAScore rubric = generateRubric(sectionSubmission);
		rubric.setSubmissionId(submission.getId());
		return rubric;
	}

	private QAAScore generateRubric(List<QAISectionSubmissionDto> sectionSubmission) {
		long available = 0;
		long na = 0;
		long score = 0;
		Map<String, Map<String, QAASectionScore>> rubricBySection = new HashMap<>();
		Map<String, QAAScoreByTag> rubricByTag = new HashMap<>();
		
		for (QAISectionSubmissionDto qaiSectionSubmission : sectionSubmission) {
			String submissionId = qaiSectionSubmission.getItemId();
			String sectionId = qaiSectionSubmission.getSectionId();
			QAISection section = getSection(sectionId);
			
			Map<String, QAASectionScore> sectionRubric = 
					rubricBySection.getOrDefault(sectionId, new HashMap<String, QAASectionScore>());
			
			for (QAIQuestionAnswerDto answer : qaiSectionSubmission.getAnswers()) {
				QAIQuestion question = getQuestionById(answer.getQuestionId());
				long points = question.getPoints();
				available += points;
				
				// get score object by category id
				String categoryId = question.getCategory().getItemId();
				QAIQuestionCategory category = getCategory(categoryId);
				QAASectionScore categoryRubric = sectionRubric.getOrDefault(categoryId, new QAASectionScore());
				categoryRubric
					.setCategoryId(categoryId)
					.setSectionId(sectionId)
					.setSubmissionId(submissionId)
					.setCategoryName(category.getName())
					.setSectionName(section.getName())
					.setOrder(section.getOrder());
				
				categoryRubric.addAvailablePoints(points);
				
				if (QAIQuestionAnswerType.NA.equals(answer.getValue())) {
					na += points;
					categoryRubric.addNaPoints(points);
				}
				if (QAIQuestionAnswerType.YES.equals(answer.getValue())) {
					score += points;
					categoryRubric.addScorePoints(points);
				}
				if (Objects.nonNull(question.getTags())) {
					String[] tags = question.getTags().split(",");
					for (int t = 0; t < tags.length; t++) {
						String tag = tags[t].trim();
						QAAScoreByTag tagRubric = rubricByTag.getOrDefault(tag, new QAAScoreByTag());
						tagRubric.setTag(tag)
							.setSubmissionId(submissionId);
						tagRubric.addAvailablePoints(points);
						if (QAIQuestionAnswerType.NA.equals(answer.getValue())) {
							tagRubric.addNaPoints(points);
						}
						if (QAIQuestionAnswerType.YES.equals(answer.getValue())) {
							tagRubric.addScorePoints(points);
						}
					}
				}
			}
			for (QAIGuestQuestionAnswerGroupDto guestAnswerGroup :  qaiSectionSubmission.getGuestAnswers()) {
				for (QAIGuestQuestionAnswerDto answer : guestAnswerGroup.getAnswers()) {
					QAIGuestQuestion question = getGuestQuestionById(answer.getGuestQuestionId());
					long points = question.getPoints();
					available += points;
					QAASectionScore categoryRubric = sectionRubric.getOrDefault(GUEST_CATEGORY, new QAASectionScore());

					categoryRubric.setCategoryId(GUEST_CATEGORY)
						.setSectionId(sectionId)
						.setSubmissionId(submissionId)
						.setCategoryName("Guest")
						.setSectionName(section.getName())
						.setOrder(99);
					
					categoryRubric.addAvailablePoints(points);
					
					if (QAIGuestQuestionAnswerType.NA.equals(answer.getValue())) {
						na += points;
						categoryRubric.addNaPoints(points);
					}
					if (QAIGuestQuestionAnswerType.YES.equals(answer.getValue())) {
						score += points;
						categoryRubric.addScorePoints(points);
					}
				}
			}
			
		}
		
		QAAScore qaaScore = new QAAScore();
		qaaScore.setOverallAvailable(available);
		qaaScore.setOverallNA(na);
		qaaScore.setOverallRequired(new BigDecimal((available - na) * 0.8));
		qaaScore.setOverallScore(score);
		qaaScore.setScoresByTag(rubricByTag.values().stream().collect(Collectors.toSet()));
		qaaScore.setSections(rubricBySection.values().stream().flatMap(s -> s.values().stream()).collect(Collectors.toSet()));
		return qaaScore;
	}

	private QAISection getSection(String sectionId) {
		return this.sectionRepo.findByIdItemId(sectionId).orElseThrow();
	}

	private QAIQuestionCategory getCategory(String categoryId) {
		return this.categoryRepo.findByIdItemId(categoryId).orElseThrow();
	}

	private QAIGuestQuestion getGuestQuestionById(String guestQuestionId) {
		QAIGuestQuestion q = this.guestQuestionRepo.findByIdItemId(guestQuestionId).orElseThrow();
		return q;
	}

	private QAIQuestion getQuestionById(String questionId) {
		QAIQuestion q = this.questionRepo.findByIdItemId(questionId).orElseThrow();
		return q;
	}

}
