package net.savantly.sprout.franchise.domain.operations.qai.section;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.QAIGuestQuestionDto;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.QAIGuestQuestionService;
import net.savantly.sprout.franchise.domain.operations.qai.question.QAIQuestion;
import net.savantly.sprout.franchise.domain.operations.qai.question.QAIQuestionDto;
import net.savantly.sprout.franchise.domain.operations.qai.question.QAIQuestionService;

public class QAISectionService {

	private final TenantKeyedRepository<QAISection> repository;
	private final QAIGuestQuestionService guestQuestionService;
	private final QAIQuestionService questionService;

	public QAISectionService(TenantKeyedRepository<QAISection> repository,
			QAIGuestQuestionService guestQuestionConverter, QAIQuestionService questionConverter) {
		this.repository = repository;
		this.guestQuestionService = guestQuestionConverter;
		this.questionService = questionConverter;
	}

	@PreAuthorize("hasAuthority('FM_QAI_READ') or hasAuthority('ADMIN')")
	public List<QAISectionDto> findAll() {
		return repository.findAll().stream().sorted(Comparator.comparingInt(QAISection::getOrder)).map(entity -> convert(entity)).collect(Collectors.toList());
	}

	@PreAuthorize("hasAuthority('FM_QAI_READ') or hasAuthority('ADMIN')")
	public QAISectionDto findByItemId(String itemId) {
		return convert(getObjectByItemId(itemId));
	}

	@PreAuthorize("hasAuthority('FM_QAI_CREATE') or hasAuthority('ADMIN')")
	public QAISectionDto create(QAISectionDto object) {
		return createEntity(object);
	}

	@PreAuthorize("hasAuthority('FM_QAI_CREATE') or hasAuthority('ADMIN')")
	public QAISectionDto update(QAISectionDto object) {
		return updateEntity(getObjectByItemId(object.getItemId()), object);
	}

	@PostAuthorize("hasAuthority('FM_QAI_ADMIN') or hasAuthority('ADMIN')")
	public void deleteById(String itemId) {
		repository.deleteByIdItemId(itemId);
	}

	private QAISection getObjectByItemId(String id) {
		return repository.findByIdItemId(id).orElseThrow(() -> new EntityNotFoundException("id: " + id));
	}

	private QAISectionDto convert(QAISection entity) {
		List<QAIQuestionDto> questions = this.questionService.findAllBySectionId(entity.getItemId());
		questions.sort(Comparator.comparingInt(QAIQuestionDto::getOrder));
		
		List<QAIGuestQuestionDto> guestQuestions = this.guestQuestionService.findAllBySectionId(entity.getItemId());
		guestQuestions.sort(Comparator.comparingInt(QAIGuestQuestionDto::getOrder));
		
		return new QAISectionDto().setItemId(entity.getItemId()).setName(entity.getName()).setOrder(entity.getOrder())
				.setRequireStaffAttendance(entity.isRequireStaffAttendance())
				.setQuestions(questions)
				.setGuestQuestions(guestQuestions);
	}

	private QAISectionDto createEntity(QAISectionDto object) {
		QAISection entity = repository.save(new QAISection().setName(object.getName()).setOrder(object.getOrder())
				.setRequireStaffAttendance(object.isRequireStaffAttendance()));
		List<QAIQuestionDto> questions = upsertQuestions(object.getQuestions(), entity.getItemId());
		List<QAIGuestQuestionDto> guestQuestions = upsertGuestQuestions(object.getGuestQuestions(), entity.getItemId());

		return new QAISectionDto().setItemId(entity.getItemId()).setName(entity.getName()).setOrder(entity.getOrder())
				.setRequireStaffAttendance(entity.isRequireStaffAttendance()).setQuestions(questions)
				.setGuestQuestions(guestQuestions);
	}

	private List<QAIQuestionDto> upsertQuestions(List<QAIQuestionDto> questions, String sectionId) {
		return questions.stream().map(q -> {
			q.setSectionId(sectionId);
			return this.questionService.upsert(q);
		}).collect(Collectors.toList());
	}

	private List<QAIGuestQuestionDto> upsertGuestQuestions(List<QAIGuestQuestionDto> questions, String sectionId) {
		return questions.stream().map(q -> {
			q.setSectionId(sectionId);
			return this.guestQuestionService.upsert(q);
		}).collect(Collectors.toList());
	}

	private QAISectionDto updateEntity(QAISection entity, QAISectionDto object) {
		List<QAIQuestionDto> questions = upsertQuestions(object.getQuestions(), object.getItemId());
		List<QAIGuestQuestionDto> guestQuestions = upsertGuestQuestions(object.getGuestQuestions(), object.getItemId());
		entity.setName(object.getName()).setOrder(object.getOrder())
				.setRequireStaffAttendance(object.isRequireStaffAttendance());
		repository.save(entity);
		return new QAISectionDto().setItemId(entity.getItemId()).setName(entity.getName()).setOrder(entity.getOrder())
				.setRequireStaffAttendance(entity.isRequireStaffAttendance()).setQuestions(questions)
				.setGuestQuestions(guestQuestions);
	}

}
