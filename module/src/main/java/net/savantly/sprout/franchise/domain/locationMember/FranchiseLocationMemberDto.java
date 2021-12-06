package net.savantly.sprout.franchise.domain.locationMember;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Getter @Setter
public class FranchiseLocationMemberDto {

	private String itemId;
	private String locationId;
	private String userId;
	private String role;
}
