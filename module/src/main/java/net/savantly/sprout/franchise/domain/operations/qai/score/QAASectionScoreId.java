package net.savantly.sprout.franchise.domain.operations.qai.score;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QAASectionScoreId  implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String submissionId;
	private String sectionId;
	private String categoryId;
}
