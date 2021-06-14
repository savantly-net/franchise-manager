package net.savantly.sprout.franchise.domain.hours;

import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.core.tenancy.TenantedPrimaryKey;
import net.savantly.sprout.franchise.domain.DtoConverter;

@Service
@RequiredArgsConstructor
public class FranchiseHoursOfOperationModifierConverter implements DtoConverter<FranchiseHoursOfOperationModifierDto, FranchiseHoursOfOperationModifier> {
	
	private final FranchiseHoursOfOperationModifierRepository repo;

	@Override
	public Optional<FranchiseHoursOfOperationModifierDto> toDto(FranchiseHoursOfOperationModifier from) {
		if(Objects.isNull(from)) {
			return Optional.empty();
		}
		FranchiseHoursOfOperationModifierDto to = new FranchiseHoursOfOperationModifierDto()
				.setCloseTime(from.getCloseTime())
				.setDateToModify(from.getDateToModify())
				.setOpenTime(from.getOpenTime())
				.setId(from.getItemId());
		return Optional.of(to);
	}

	@Override
	public Optional<FranchiseHoursOfOperationModifier> toEntity(FranchiseHoursOfOperationModifierDto from) {
		if(Objects.isNull(from)) {
			return Optional.empty();
		}
		FranchiseHoursOfOperationModifier to = repo.findByIdItemId(from.getId()).orElse(new FranchiseHoursOfOperationModifier())
				.setCloseTime(from.getCloseTime())
				.setDateToModify(from.getDateToModify())
				.setOpenTime(from.getOpenTime());
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
