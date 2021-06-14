package net.savantly.sprout.franchise.domain.hours;

import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.core.tenancy.TenantedPrimaryKey;
import net.savantly.sprout.franchise.domain.DtoConverter;

@RequiredArgsConstructor
@Service
public class FranchiseHoursOfOperationConverter implements DtoConverter<FranchiseHoursOfOperationDto, FranchiseHoursOfOperation> {
	
	private final FranchiseHoursOfOperationRepository repo;

	@Override
	public Optional<FranchiseHoursOfOperationDto> toDto(FranchiseHoursOfOperation from) {
		if(Objects.isNull(from)) {
			return Optional.empty();
		}
		FranchiseHoursOfOperationDto to = new FranchiseHoursOfOperationDto()
				.setId(from.getItemId())
				.setSundayOpen(from.getSundayOpen())
				.setSundayClose(from.getSundayClose())
				.setMondayOpen(from.getMondayOpen())
				.setMondayClose(from.getMondayClose())
				.setTuesdayOpen(from.getTuesdayOpen())
				.setTuesdayClose(from.getTuesdayClose())
				.setWednesdayOpen(from.getWednesdayOpen())
				.setWednesdayClose(from.getWednesdayClose())
				.setThursdayOpen(from.getThursdayOpen())
				.setThursdayClose(from.getThursdayClose())
				.setFridayOpen(from.getFridayOpen())
				.setFridayClose(from.getFridayClose())
				.setSaturdayOpen(from.getSaturdayOpen())
				.setSaturdayClose(from.getSaturdayClose());
		return Optional.of(to);
	}

	@Override
	public Optional<FranchiseHoursOfOperation> toEntity(FranchiseHoursOfOperationDto from) {
		if(Objects.isNull(from)) {
			return Optional.empty();
		}
		FranchiseHoursOfOperation to = repo.findByIdItemId(from.getId()).orElse(new FranchiseHoursOfOperation())
				.setSundayOpen(from.getSundayOpen())
				.setSundayClose(from.getSundayClose())
				.setMondayOpen(from.getMondayOpen())
				.setMondayClose(from.getMondayClose())
				.setTuesdayOpen(from.getTuesdayOpen())
				.setTuesdayClose(from.getTuesdayClose())
				.setWednesdayOpen(from.getWednesdayOpen())
				.setWednesdayClose(from.getWednesdayClose())
				.setThursdayOpen(from.getThursdayOpen())
				.setThursdayClose(from.getThursdayClose())
				.setFridayOpen(from.getFridayOpen())
				.setFridayClose(from.getFridayClose())
				.setSaturdayOpen(from.getSaturdayOpen())
				.setSaturdayClose(from.getSaturdayClose());
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
