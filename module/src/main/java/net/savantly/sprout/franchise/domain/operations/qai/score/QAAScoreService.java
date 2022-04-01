package net.savantly.sprout.franchise.domain.operations.qai.score;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.franchise.domain.operations.qai.audit.QAASubmission;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISectionSubmissionDto;

@RequiredArgsConstructor
public class QAAScoreService {

	private final QAAScoreRepository repo;
	private final QAAScoreCalculator calc;

	public QAAScoreDto getScoreBySubmissionId(String id) {
		QAAScore entity = repo.getOne(id);
		return convert(entity);
	}
	
	public QAAScoreDto createScoreFromSubmission(QAASubmission submission, List<QAISectionSubmissionDto> sectionSubmission) {
		QAAScore entity = calc.createScoreFromSubmission(submission, sectionSubmission);
		return convert(repo.save(entity));
	}

	private QAAScoreDto convert(QAAScore from) {
		QAAScoreDto dto = new QAAScoreDto()
			.setOverallAvailable(from.getOverallAvailable())
			.setOverallNA(from.getOverallNA())
			.setOverallRating(from.getOverallRating())
			.setOverallRequired(from.getOverallRating())
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
			.setRequired(from.getRequired())
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
