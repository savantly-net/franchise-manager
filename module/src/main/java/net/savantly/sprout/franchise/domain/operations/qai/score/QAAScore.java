package net.savantly.sprout.franchise.domain.operations.qai.score;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;


@Entity
@Accessors(chain = true)
@Getter
@Setter
@Table(name = "fm_qaa_score")
public class QAAScore {
	
	private final double requiredPercentage = 0.8;

	@Id
	@Column(name = "submission_id")
	private String submissionId;

	@Column(name = "available_points")
	private long overallAvailable;

	@Column(name = "na_points")
	private long overallNA;

	@Transient
	private long getOverallRequired() {
		return Math.round((overallAvailable - overallNA) * requiredPercentage);
	}

	@Column(name = "scored_points")
	private long overallScore;

	@Transient
	public BigDecimal getOverallRating() {
		if (overallAvailable == 0 || overallScore == 0) {
			return BigDecimal.ZERO;
		} else {
			return new BigDecimal(overallScore).setScale(2).divide(new BigDecimal(overallAvailable), RoundingMode.HALF_UP).setScale(2);
		}
	};
	
	public void addAvailablePoints(long points) {
		this.overallAvailable += points;
	}
	public void addNaPoints(long points) {
		this.overallNA += points;
	}
	public void addScorePoints(long points) {
		this.overallScore += points;
	}


	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "submission_id")
	private Set<QAASectionScore> sections = new HashSet<>();


	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "submission_id")
	private Set<QAAScoreByTag> scoresByTag = new HashSet<>(); 
}
