package net.savantly.sprout.franchise.domain.building;

import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.core.tenancy.TenantedPrimaryKey;
import net.savantly.sprout.franchise.domain.DtoConverter;

@Service
@RequiredArgsConstructor
public class FranchiseBuildingConverter implements DtoConverter<FranchiseBuildingDto, FranchiseBuilding> {
	
	private final FranchiseBuildingRepository repo;

	@Override
	public Optional<FranchiseBuildingDto> toDto(FranchiseBuilding from) {
		if(Objects.isNull(from)) {
			return Optional.empty();
		}
		FranchiseBuildingDto to = new FranchiseBuildingDto()
				.setBohSquareFeet(from.getBohSquareFeet())
				.setFohSquareFeet(from.getFohSquareFeet())
				.setLeaseSignDate(from.getLeaseSignDate())
				.setMaxOccupancy(from.getMaxOccupancy())
				.setMaxSeating(from.getMaxSeating())
				.setTotalSquareFeet(from.getTotalSquareFeet())
				.setId(from.getItemId());
		return Optional.of(to);
	}

	@Override
	public Optional<FranchiseBuilding> toEntity(FranchiseBuildingDto from) {
		if(Objects.isNull(from)) {
			return Optional.empty();
		}
		FranchiseBuilding to = repo.findByIdItemId(from.getId()).orElse(new FranchiseBuilding())
				.setBohSquareFeet(from.getBohSquareFeet())
				.setFohSquareFeet(from.getFohSquareFeet())
				.setLeaseSignDate(from.getLeaseSignDate())
				.setMaxOccupancy(from.getMaxOccupancy())
				.setMaxSeating(from.getMaxSeating())
				.setTotalSquareFeet(from.getTotalSquareFeet());
		String itemId = null;
		if (Objects.nonNull(from.getId()) && !from.getId().isEmpty()) {
			itemId = from.getId();
		}
		if(Objects.isNull(to.getId())) {
			to.setId(new TenantedPrimaryKey());
		}
		to.getId().setItemId(itemId);
		return Optional.of(to);
	}

}
