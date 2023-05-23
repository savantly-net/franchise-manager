package net.savantly.sprout.franchise.domain.operations.qai.score;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.savantly.sprout.franchise.domain.operations.qai.audit.QAASubmission;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISectionSubmissionDto;

@RequiredArgsConstructor
@Slf4j
public class QAAScoreService {

	private final QAAScoreRepository repo;
	private final QAAScoreCalculator calc;
	private final QAASectionScoreRepository sectionScoreRepo;
	private final QAAScoreByTagRepository tagScoreRepo;

	public QAAScoreDto getScoreBySubmissionId(String id) {
		QAAScore entity = repo.getOne(id);
		Set<QAASectionScore> sectionScores = sectionScoreRepo.findBySubmissionId(id);
		log.info("got section scores: {}", sectionScores.size());
		entity.setSections(sectionScores);
		Set<QAAScoreByTag> tagScores = tagScoreRepo.findBySubmissionId(id);
		log.info("got tag scores: {}", tagScores.size());
		entity.setScoresByTag(tagScores);
		return convert(entity);
	}
	
	public QAAScoreDto createScoreFromSubmission(QAASubmission submission, List<QAISectionSubmissionDto> sectionSubmission) {
		log.info("creating score from submission: {}", submission.getId());
		Optional<QAAScore> optPrevious = repo.findById(submission.getId());
		if (optPrevious.isPresent()){
			log.info("previous score found: {}", submission.getId());
			QAAScore previous = optPrevious.get();
			log.info("removing sections from previous score: {}", previous.getSubmissionId());
			previous.removeAllSections();
			sectionScoreRepo.deleteBySubmissionId(previous.getSubmissionId());
			log.info("removing scores by tag from previous score: {}", previous.getSubmissionId());
			previous.removeAllScoresByTag();
			tagScoreRepo.deleteBySubmissionId(previous.getSubmissionId());
			log.info("deleting previous score record: {}", previous.getSubmissionId());
			repo.delete(previous);
		}
		log.info("calculating score for submission: {}", submission.getId());
		QAAScore entity = calc.createScoreFromSubmission(submission, sectionSubmission);
		log.info("saving section scores: {}", entity.getSections().size());
		sectionScoreRepo.saveAll(entity.getSections());
		log.info("saving tag scores: {}", entity.getScoresByTag().size());
		tagScoreRepo.saveAll(entity.getScoresByTag());
		log.info("saving score: {}", entity.getSubmissionId());
		return convert(repo.save(entity));
	}

	private QAAScoreDto convert(QAAScore from) {
		QAAScoreDto dto = new QAAScoreDto()
			.setOverallAvailable(from.getOverallAvailable())
			.setOverallNA(from.getOverallNA())
			.setOverallRating(from.getOverallRating())
			.setOverallRequired(from.getOverallRequired())
			.setOverallScore(from.getOverallScore())
			.setScoresByTag(from.getScoresByTag().stream().map(s -> convert(s)).collect(Collectors.toList()))
			.setSections(convert(from.getSections()));
		return dto;
	}
	
	private List<QAASectionScoreDto> convert(Set<QAASectionScore> sections) {
		if (sections.isEmpty()) {
			return new ArrayList<QAASectionScoreDto>();
		}
		
		Map<String, QAASectionScoreDto> dto = new HashMap<String, QAASectionScoreDto>();
		for (QAASectionScore qaaSectionScore : sections) {
			QAASectionScoreDto sectionDto;
			if (dto.containsKey(qaaSectionScore.getSectionId())) {
				sectionDto = dto.get(qaaSectionScore.getSectionId());
			} else {
				sectionDto = new QAASectionScoreDto();
				dto.put(qaaSectionScore.getSectionId(), sectionDto);
			}
			
			sectionDto.getCategoryScores().add(convert(qaaSectionScore));
		}
		for (Entry<String, QAASectionScoreDto> v : dto.entrySet()) {
			if (!v.getValue().getCategoryScores().isEmpty()) {
				QAASectionCategoryScoreDto first = v.getValue().getCategoryScores().get(0);
				v.getValue().setOrder(first.getSectionOrder())
					.setSectionId(v.getKey())
					.setSectionName(v.getValue().getSectionName());
			}
			
		}
		return dto.values().stream().sorted(Comparator.comparing(QAASectionScoreDto::getOrder)).collect(Collectors.toList());
	}

	private QAASectionCategoryScoreDto convert(QAASectionScore from) {
		return new QAASectionCategoryScoreDto()
			.setAvailable(from.getAvailable())
			.setCategoryName(from.getCategoryName())
			.setNa(from.getNa())
			.setRating(from.getRating())
			.setScore(from.getScore())
			.setSectionOrder(from.getOrder());
	}

	private QAAScoreByTagDto convert(QAAScoreByTag from) {
		QAAScoreByTagDto dto = new QAAScoreByTagDto()
			.setAvailable(from.getAvailable())
			.setNa(from.getNa())
			.setRating(from.getRating())
			.setRequired(from.getRequired())
			.setScore(from.getScore())
			.setTag(from.getTag());
		return dto;
	}

}
