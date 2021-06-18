package net.savantly.sprout.franchise.domain.operations.qai;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.QAIGuestQuestionRepository;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.QAIGuestQuestionService;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answer.QAIGuestQuestionAnswerRespository;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answer.QAIGuestQuestionAnswerService;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answerGroup.QAIGuestQuestionAnswerGroupRepository;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answerGroup.QAIGuestQuestionAnswerGroupService;
import net.savantly.sprout.franchise.domain.operations.qai.question.QAIQuestionRepository;
import net.savantly.sprout.franchise.domain.operations.qai.question.QAIQuestionService;
import net.savantly.sprout.franchise.domain.operations.qai.question.answer.QAIQuestionAnswerRepository;
import net.savantly.sprout.franchise.domain.operations.qai.question.answer.QAIQuestionAnswerService;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategoryApi;
import net.savantly.sprout.franchise.domain.operations.qai.question.category.QAIQuestionCategoryRepository;
import net.savantly.sprout.franchise.domain.operations.qai.section.QAISectionApi;
import net.savantly.sprout.franchise.domain.operations.qai.section.QAISectionRepository;
import net.savantly.sprout.franchise.domain.operations.qai.section.QAISectionService;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISectionSubmission;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISectionSubmissionApi;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISectionSubmissionRepository;
import net.savantly.sprout.franchise.domain.operations.qai.section.submission.QAISubmissionService;

@Configuration
public class QAIConfiguration {

	@Bean
	public QAIQuestionAnswerService qaiQuestionAnswerService(QAIQuestionAnswerRepository repository) {
		return new QAIQuestionAnswerService(repository);
	}

	@Bean
	public QAIGuestQuestionAnswerService qaiGuestQuestionAnswerService(QAIGuestQuestionAnswerRespository repository) {
		return new QAIGuestQuestionAnswerService(repository);
	}

	@Bean
	public QAIGuestQuestionAnswerGroupService qaiGuestQuestionAnswerGroupService(
			QAIGuestQuestionAnswerGroupRepository repository, QAIGuestQuestionAnswerService gqaService) {
		return new QAIGuestQuestionAnswerGroupService(repository, gqaService);
	}

	@Bean
	public QAISubmissionService qaiSubmissionService(QAIQuestionAnswerService qaService,
			QAIGuestQuestionAnswerGroupService gqaService, QAISectionSubmissionRepository repository) {
		return new QAISubmissionService(repository, qaService, gqaService);
	}

	@Bean
	public QAISectionSubmissionApi qaiSectionSubmissionApi(TenantKeyedRepository<QAISectionSubmission> repository,
			QAISubmissionService service) {
		return new QAISectionSubmissionApi(repository, service);
	}

	@Bean
	public QAIQuestionCategoryApi qaiQuestionCategoryApi(QAIQuestionCategoryRepository repository) {
		return new QAIQuestionCategoryApi(repository);
	}

	@Bean
	public QAISectionService qaiSectionService(QAISectionRepository repository,
			QAIGuestQuestionService guestQuestionConverter, QAIQuestionService questionConverter) {
		return new QAISectionService(repository, guestQuestionConverter, questionConverter);
	}

	@Bean
	public QAISectionApi qaiSectionApi(QAISectionService service) {
		return new QAISectionApi(service);
	}

	@Bean
	public QAIQuestionService qaiQuestionConverter(QAIQuestionRepository repository,
			QAIQuestionCategoryRepository categories) {
		return new QAIQuestionService(repository, categories);
	}

	@Bean
	public QAIGuestQuestionService qaiGuestQuestionConverter(QAIGuestQuestionRepository repository) {
		return new QAIGuestQuestionService(repository);
	}
}
