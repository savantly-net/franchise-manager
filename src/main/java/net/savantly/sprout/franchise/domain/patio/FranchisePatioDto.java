package net.savantly.sprout.franchise.domain.patio;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter @Setter
@Accessors(chain = true)
public class FranchisePatioDto {
	private String id;
	private int totalSquareFeet;
}
