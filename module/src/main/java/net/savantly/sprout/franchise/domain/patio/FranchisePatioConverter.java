package net.savantly.sprout.franchise.domain.patio;

import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.core.tenancy.TenantedPrimaryKey;
import net.savantly.sprout.franchise.domain.DtoConverter;

@Service
@RequiredArgsConstructor
public class FranchisePatioConverter implements DtoConverter<FranchisePatioDto, FranchisePatio> {
	
	private final FranchisePatioRepository repo;

	@Override
	public Optional<FranchisePatioDto> toDto(FranchisePatio from) {
		if(Objects.isNull(from)) {
			return Optional.empty();
		}
		FranchisePatioDto to = new FranchisePatioDto()
				.setTotalSquareFeet(from.getTotalSquareFeet())
				.setId(from.getItemId());
		return Optional.of(to);
	}

	@Override
	public Optional<FranchisePatio> toEntity(FranchisePatioDto from) {
		if(Objects.isNull(from)) {
			return Optional.empty();
		}
		FranchisePatio to = repo.findByIdItemId(from.getId()).orElse(new FranchisePatio())
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
