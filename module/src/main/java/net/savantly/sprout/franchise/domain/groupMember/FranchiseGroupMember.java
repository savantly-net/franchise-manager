package net.savantly.sprout.franchise.domain.groupMember;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import net.savantly.sprout.core.tenancy.TenantKeyedEntity;

@Entity
@Getter @Setter
@Table(name = "fm_group_member")
public class FranchiseGroupMember extends TenantKeyedEntity {

	private String franchiseGroupId;
	private String userId;
	private String role;
}
