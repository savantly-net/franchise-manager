package net.savantly.sprout.franchise.domain.pos;

import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.core.tenancy.TenantedPrimaryKey;
import net.savantly.sprout.franchise.domain.DtoConverter;

@Service
@RequiredArgsConstructor
public class FranchisePOSConverter implements DtoConverter<FranchisePOSDto, FranchisePOS> {
	
	private final FranchisePOSRepository repo;

	@Override
	public Optional<FranchisePOSDto> toDto(FranchisePOS from) {
		if(Objects.isNull(from)) {
			return Optional.empty();
		}
		FranchisePOSDto to = new FranchisePOSDto()
				.setId(from.getItemId())
				.setPhysicalTerminals(from.getPhysicalTerminals())
				.setVirtualTerminals(from.getVirtualTerminals());
		return Optional.of(to);
	}

	@Override
	public Optional<FranchisePOS> toEntity(FranchisePOSDto from) {
		if(Objects.isNull(from)) {
			return Optional.empty();
		}
		FranchisePOS to = repo.findByIdItemId(from.getId()).orElse(new FranchisePOS())
				.setPhysicalTerminals(from.getPhysicalTerminals())
				.setVirtualTerminals(from.getVirtualTerminals());
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
