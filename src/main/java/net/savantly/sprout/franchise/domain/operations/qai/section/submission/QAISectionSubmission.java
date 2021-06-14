package net.savantly.sprout.franchise.domain.operations.qai.section.submission;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.MapKeyColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answerGroup.QAIGuestQuestionAnswerGroup;
import net.savantly.sprout.franchise.domain.operations.qai.question.answer.QAIQuestionAnswer;

@Entity
@Table(name = "fm_qai_section_submission")
@Getter
@Setter
@Accessors(chain = true)
public class QAISectionSubmission extends TenantKeyedEntity {

	private String sectionId;
	private String locationId;
	private String managerOnDuty;
	private ZonedDateTime dateScored;

	@Enumerated(EnumType.STRING)
	private QAISubmissionState status;

	@OneToMany
	private List<QAIQuestionAnswer> answers = new ArrayList<>();

	@OneToMany
	private List<QAIGuestQuestionAnswerGroup> guestAnswers = new ArrayList<>();

	@ElementCollection
	@MapKeyColumn(name = "name")
	@Column(name = "value")
	@CollectionTable(name = "fm_qai_staff_attendance", joinColumns = { @JoinColumn(name = "tenant_id"),
			@JoinColumn(name = "item_id") })
	Map<String, String> staffAttendance = new HashMap<String, String>(); // maps from attribute name to value

}
