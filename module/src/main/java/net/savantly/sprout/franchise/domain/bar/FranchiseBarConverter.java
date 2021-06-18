package net.savantly.sprout.franchise.domain.bar;

import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.core.tenancy.TenantedPrimaryKey;
import net.savantly.sprout.franchise.domain.DtoConverter;

@Service
@RequiredArgsConstructor
public class FranchiseBarConverter implements DtoConverter<FranchiseBarDto, FranchiseBar> {
	
	private final FranchiseBarRepository repo;

	@Override
	public Optional<FranchiseBarDto> toDto(FranchiseBar from) {
		if(Objects.isNull(from)) {
			return Optional.empty();
		}
		FranchiseBarDto to = new FranchiseBarDto()
				.setBeer(from.isBeer())
				.setId(from.getId().getItemId())
				.setLinearFeet(from.getLinearFeet())
				.setLiquor(from.isLiquor())
				.setStandalone(from.isStandalone())
				.setId(from.getItemId());
		return Optional.of(to);
	}

	@Override
	public Optional<FranchiseBar> toEntity(FranchiseBarDto from) {
		if(Objects.isNull(from)) {
			return Optional.empty();
		}
		FranchiseBar to = repo.findByIdItemId(from.getId()).orElse(new FranchiseBar())
				.setBeer(from.isBeer())
				.setLinearFeet(from.getLinearFeet())
				.setLiquor(from.isLiquor())
				.setStandalone(from.isStandalone());
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
