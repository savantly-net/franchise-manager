package net.savantly.sprout.franchise.domain.locationMember;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.util.StringUtils;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class FranchiseLocationMemberService {
	
	private final FranchiseLocationMemberRepository repo;
	
	public List<FranchiseLocationMemberDto> getMembers(String locationId) {
		return convert(repo.findByLocationId(locationId));
	}

	public List<FranchiseLocationMemberDto> getByMemberUserId(String userId) {
		return convert(repo.findByUserId(userId));
	}
	

	public void updateMembers(String locationId, List<FranchiseLocationMemberDto> members) {
		List<String> ids = members.stream().filter(m -> Objects.nonNull(m.getItemId())).map(m -> m.getItemId()).collect(Collectors.toList());
		List<FranchiseLocationMember> current = repo.findByLocationId(locationId);
		List<FranchiseLocationMember> toDelete = new ArrayList<>();
		current.forEach(c -> {
			if (ids.stream().noneMatch(id -> c.getItemId().contentEquals(id))) {
				toDelete.add(c);
			}
		});
		List<FranchiseLocationMemberDto> toAdd = new ArrayList<>();
		members.forEach(m -> {
			if (Objects.isNull(m.getItemId()) || StringUtils.isEmpty(m.getItemId())) {
				toAdd.add(m);
			}
		});
		repo.deleteAll(toDelete);
		repo.saveAll(convertDto(toAdd));
	}

	private List<FranchiseLocationMemberDto> convert(List<FranchiseLocationMember> members) {
		return members.stream().map(item -> new FranchiseLocationMemberDto()
				.setItemId(item.getItemId())
				.setLocationId(item.getLocationId())
				.setRole(item.getRole())
				.setUserId(item.getUserId()))
			.collect(Collectors.toList());
	}
	
	private List<FranchiseLocationMember> convertDto(List<FranchiseLocationMemberDto> members) {
		return members.stream().map(item -> new FranchiseLocationMember()
				.setLocationId(item.getLocationId())
				.setRole(item.getRole())
				.setUserId(item.getUserId()))
			.collect(Collectors.toList());
	}
}
