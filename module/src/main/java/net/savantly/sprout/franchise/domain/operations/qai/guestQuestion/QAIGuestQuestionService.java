package net.savantly.sprout.franchise.domain.operations.qai.guestQuestion;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class QAIGuestQuestionService {

	private final QAIGuestQuestionRepository repository;

	public List<QAIGuestQuestionDto> findAllBySectionId(String sectionId) {
		return repository.findBySectionId(sectionId).stream().map(q -> convert(q)).collect(Collectors.toList());
	}

	public QAIGuestQuestionDto upsert(QAIGuestQuestionDto item) {
		Optional<QAIGuestQuestion> optional = this.repository.findByIdItemId(item.getItemId());
		QAIGuestQuestion entity = null;
		if (optional.isPresent()) {
			entity = optional.get();
		} else {
			entity = new QAIGuestQuestion();
		}
		entity.setOrder(item.getOrder()).setPoints(item.getPoints()).setText(item.getText())
				.setDeleted(item.isDeleted()).setSectionId(item.getSectionId());
		this.repository.save(entity);
		return convert(entity);
	}

	private QAIGuestQuestionDto convert(QAIGuestQuestion item) {
		return new QAIGuestQuestionDto()
			.setItemId(item.getItemId())
			.setSectionId(item.getSectionId())
			.setOrder(item.getOrder())
			.setPoints(item.getPoints())
			.setText(item.getText())
			.setDeleted(item.isDeleted());
	}

}
