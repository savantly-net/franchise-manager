package net.savantly.sprout.franchise.domain.pos;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Getter @Setter
public class FranchisePOSDto {

	private String id;
	private int physicalTerminals;
	private int virtualTerminals;
}
