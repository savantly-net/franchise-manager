package net.savantly.sprout.franchise.domain.operations.qai.score;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Entity
@Accessors(chain = true)
@Getter
@Setter
@IdClass(QAASectionScoreId.class)
@Table(name = "fm_qaa_score_section")
public class QAASectionScore {

	@Id
	@Column(name = "submission_id")
	private String submissionId;

	@Id
	@Column(name = "section_id")
	private String sectionId;

	@Id
	@Column(name = "category_id")
	private String categoryId;
	
	@Column(name = "section_order")
	private long order;
	
	@Column(name= "section_name")
	private String sectionName;
	
	@Column(name = "category_name")
	private String categoryName;

	@Column(name = "available_points")
	private long available;

	@Column(name = "na_points")
	private long na;

	@Column(name = "required_points")
	private BigDecimal required;

	@Column(name = "scored_points")
	private long score;
	
	@Transient
	public BigDecimal getRating() {
		if (Objects.isNull(required) || required == BigDecimal.ZERO) {
			return BigDecimal.ZERO;
		} else {
			return new BigDecimal(score).divide(required, RoundingMode.HALF_UP);
		}
	};
	
	public void addAvailablePoints(long points) {
		this.available += points;
	}
	public void addNaPoints(long points) {
		this.na += points;
	}
	public void addScorePoints(long points) {
		this.score += points;
	}
}
