package net.savantly.sprout.franchise.domain.locationOpenDateInterval;

import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.core.tenancy.TenantedPrimaryKey;
import net.savantly.sprout.franchise.domain.DtoConverter;

@Service
@RequiredArgsConstructor
public class LocationOpenDateIntervalConverter implements DtoConverter<LocationOpenDateIntervalDto, LocationOpenDateInterval> {

    private final LocationOpenDateIntervalRepository repo;
    
    @Override
    public Optional<LocationOpenDateIntervalDto> toDto(LocationOpenDateInterval from) {
        if(Objects.isNull(from)) {
			return Optional.empty();
		}
        LocationOpenDateIntervalDto to = new LocationOpenDateIntervalDto()
            .setStart(from.getStart())
            .setEnd(from.getEnd())
            .setId(from.getItemId());
        return Optional.of(to);
    }

    @Override
    public Optional<LocationOpenDateInterval> toEntity(LocationOpenDateIntervalDto from) {
        if(Objects.isNull(from)) {
			return Optional.empty();
		}
        LocationOpenDateInterval to = repo.findByIdItemId(from.getId()).orElse(new LocationOpenDateInterval()
            .setStart(from.getStart())
            .setEnd(from.getEnd()));

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
