package net.savantly.sprout.franchise.domain.operations.qai.question;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategory;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategoryRepository;

@RequiredArgsConstructor
public class QAIQuestionService {

	private final QAIQuestionRepository repository;
	private final QAIQuestionCategoryRepository categories;


	public List<QAIQuestionDto> findAllBySectionId(String sectionId) {
		return repository.findBySectionId(sectionId).stream().map(q -> convert(q)).collect(Collectors.toList());
	}

	public QAIQuestionDto upsert(QAIQuestionDto item) {
		Optional<QAIQuestion> optional = this.repository.findByIdItemId(item.getItemId());
		QAIQuestion entity = null;
		if (optional.isPresent()) {
			entity = optional.get();
		} else {
			entity = new QAIQuestion();
		}
		entity.setOrder(item.getOrder())
			.setPoints(item.getPoints())
			.setText(item.getText())
			.setCategory(findCategory(item.getCategoryId()))
			.setTags(item.getTags())
			.setDeleted(item.isDeleted())
			.setSectionId(item.getSectionId());
		this.repository.save(entity);
		return convert(entity);
	}

	private QAIQuestionDto convert(QAIQuestion item) {
		return new QAIQuestionDto().setItemId(item.getItemId()).setSectionId(item.getSectionId())
				.setOrder(item.getOrder()).setPoints(item.getPoints()).setText(item.getText()).setTags(item.getTags())
				.setCategoryId(item.getCategory().getItemId()).setDeleted(item.isDeleted());
	}

	private QAIQuestionCategory findCategory(String categoryItemId) {
		return categories.findByIdItemId(categoryItemId)
				.orElseThrow(() -> new EntityNotFoundException("Unknown Category"));
	}

}
