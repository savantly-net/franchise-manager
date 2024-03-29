package net.savantly.sprout.franchise.domain.operations.qai.score;

import java.math.BigDecimal;
import java.math.RoundingMode;

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
@IdClass(QAAScoreByTagId.class)
@Table(name = "fm_qaa_score_tag")
public class QAAScoreByTag {

	@Transient
	private final double requiredPercentage = 0.8;

	@Id
	@Column(name = "submission_id")
	private String submissionId;

	@Id
	private String tag;

	@Column(name = "available_points")
	private long available;

	@Column(name = "na_points")
	private long na;

	@Transient
	public long getRequired() {
		return Math.round((available - na) * requiredPercentage);
	}

	@Column(name = "scored_points")
	private long score;

	@Transient
	public BigDecimal getRating() {
		if (available == 0 || score == 0) {
			return BigDecimal.ZERO;
		} else {
			return new BigDecimal(score).setScale(2).divide(new BigDecimal(available - na), RoundingMode.HALF_UP)
					.setScale(2);
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
