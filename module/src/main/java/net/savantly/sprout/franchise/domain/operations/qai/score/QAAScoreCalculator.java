package net.savantly.sprout.franchise.domain.operations.qai.score;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
	
	private final Logger log = LoggerFactory.getLogger(QAAScoreCalculator.class);
	
	private final String GUEST_CATEGORY = "GUEST";
	
	private final QAISectionRepository sectionRepo;
	private final QAIQuestionRepository questionRepo;
	private final QAIGuestQuestionRepository guestQuestionRepo;
	private final QAIQuestionCategoryRepository categoryRepo;
	
	private final double requiredPercentage = 0.8;

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
			
			Map<String, QAASectionScore> sectionRubric;
			if(rubricBySection.containsKey(sectionId)) {
				sectionRubric = rubricBySection.get(sectionId);
			} else {
				sectionRubric = new HashMap<String, QAASectionScore>();
				rubricBySection.put(sectionId, sectionRubric);
			}
			
			for (QAIQuestionAnswerDto answer : qaiSectionSubmission.getAnswers().stream().filter(q -> Objects.nonNull(q.getQuestionId())).collect(Collectors.toList())) {
				QAIQuestion question = getQuestionById(answer.getQuestionId());
				long points = question.getPoints();
				available += points;
				
				// get score object by category id
				String categoryId = question.getCategory().getItemId();
				QAIQuestionCategory category = getCategory(categoryId);
				
				QAASectionScore categoryRubric;
				if (sectionRubric.containsKey(categoryId)) {
					categoryRubric = sectionRubric.get(categoryId);
				} else {
					categoryRubric = new QAASectionScore();
					sectionRubric.put(categoryId, categoryRubric);
				}
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
						if (Objects.nonNull(tag) && tag != "") {
							QAAScoreByTag tagRubric;
							if (rubricByTag.containsKey(tag)) {
								tagRubric = rubricByTag.get(tag);
							} else {
								tagRubric = new QAAScoreByTag();
								rubricByTag.put(tag, tagRubric);
							}
							
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
			}
			for (QAIGuestQuestionAnswerGroupDto guestAnswerGroup :  qaiSectionSubmission.getGuestAnswers()) {
				for (QAIGuestQuestionAnswerDto answer : guestAnswerGroup.getAnswers()) {
					QAIGuestQuestion question = getGuestQuestionById(answer.getGuestQuestionId());
					long points = question.getPoints();
					available += points;
					
					QAASectionScore categoryRubric;
					if (sectionRubric.containsKey(GUEST_CATEGORY)) {
						categoryRubric = sectionRubric.get(GUEST_CATEGORY);
					} else {
						categoryRubric = new QAASectionScore();
						sectionRubric.put(GUEST_CATEGORY, categoryRubric);
					}

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
		
		Set<QAAScoreByTag> scoresByTag = rubricByTag.values().stream().collect(Collectors.toSet());
		Set<QAASectionScore> scoresBySection = rubricBySection.values().stream().flatMap(s -> s.values().stream()).collect(Collectors.toSet());
		
		QAAScore qaaScore = new QAAScore();
		qaaScore.setOverallAvailable(available);
		qaaScore.setOverallNA(na);
		qaaScore.setOverallScore(score);
		qaaScore.setScoresByTag(scoresByTag);
		qaaScore.setSections(scoresBySection);
		return qaaScore;
	}

	private QAISection getSection(String sectionId) {
		log.info("finding QAISection by id: {}", sectionId);
		return this.sectionRepo.findByIdItemId(sectionId).orElseThrow();
	}

	private QAIQuestionCategory getCategory(String categoryId) {
		log.info("finding QAIQuestionCategory by id: {}", categoryId);
		return this.categoryRepo.findByIdItemId(categoryId).orElseThrow();
	}

	private QAIGuestQuestion getGuestQuestionById(String guestQuestionId) {
		log.info("finding QAIGuestQuestion by id: {}", guestQuestionId);
		QAIGuestQuestion q = this.guestQuestionRepo.findByIdItemId(guestQuestionId).orElseThrow();
		return q;
	}

	private QAIQuestion getQuestionById(String questionId) {
		log.info("finding QAIQuestion by id: {}", questionId);
		QAIQuestion q = this.questionRepo.findByIdItemId(questionId).orElseThrow();
		return q;
	}

}
