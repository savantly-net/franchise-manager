package net.savantly.sprout.franchise.domain.bar;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Getter @Setter
public class FranchiseBarDto {
	private String id;
	private boolean standalone;
	private int linearFeet;
	private boolean beer;
	private boolean liquor;
}
