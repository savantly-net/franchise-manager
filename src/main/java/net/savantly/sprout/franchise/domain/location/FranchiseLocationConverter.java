package net.savantly.sprout.franchise.domain.location;

import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.core.tenancy.TenantedPrimaryKey;
import net.savantly.sprout.franchise.domain.DtoConverter;
import net.savantly.sprout.franchise.domain.bar.FranchiseBar;
import net.savantly.sprout.franchise.domain.bar.FranchiseBarConverter;
import net.savantly.sprout.franchise.domain.building.FranchiseBuilding;
import net.savantly.sprout.franchise.domain.building.FranchiseBuildingConverter;
import net.savantly.sprout.franchise.domain.building.FranchiseBuildingDto;
import net.savantly.sprout.franchise.domain.hours.FranchiseHoursOfOperation;
import net.savantly.sprout.franchise.domain.hours.FranchiseHoursOfOperationConverter;
import net.savantly.sprout.franchise.domain.hours.FranchiseHoursOfOperationDto;
import net.savantly.sprout.franchise.domain.hours.FranchiseHoursOfOperationModifier;
import net.savantly.sprout.franchise.domain.hours.FranchiseHoursOfOperationModifierConverter;
import net.savantly.sprout.franchise.domain.patio.FranchisePatio;
import net.savantly.sprout.franchise.domain.patio.FranchisePatioConverter;
import net.savantly.sprout.franchise.domain.pos.FranchisePOS;
import net.savantly.sprout.franchise.domain.pos.FranchisePOSConverter;
import net.savantly.sprout.franchise.domain.pos.FranchisePOSDto;

@Service
@RequiredArgsConstructor
public class FranchiseLocationConverter implements DtoConverter<FranchiseLocationDto, FranchiseLocation> {
	
	private final FranchiseLocationRepository repo;
	private final FranchiseBarConverter barConverter;
	private final FranchiseBuildingConverter buildingConverter;
	private final FranchiseHoursOfOperationConverter hoursConverter;
	private final FranchiseHoursOfOperationModifierConverter hoursModifierConverter;
	private final FranchisePatioConverter patioConverter;
	private final FranchisePOSConverter posConverter;

	public Optional<FranchiseLocationDto> toDto(FranchiseLocation from) {
		if(Objects.isNull(from)) {
			return Optional.empty();
		}
		FranchiseLocationDto to = new FranchiseLocationDto()
				.setAddress1(from.getAddress1())
				.setAddress2(from.getAddress2())
				.setBars(from.getBars().parallelStream().map(b -> barConverter.toDto(b).orElse(null))
						.filter(b -> Objects.nonNull(b))
						.collect(Collectors.toSet()))
				.setBuilding(buildingConverter.toDto(from.getBuilding()).orElse(new FranchiseBuildingDto()))
				.setCity(from.getCity())
				.setConcept(from.getConcept())
				.setCountry(from.getCountry())
				.setGroupId(from.getGroupId())
				.setHours(hoursConverter.toDto(from.getHours()).orElse(new FranchiseHoursOfOperationDto()))
				.setId(from.getItemId())
				.setLocationType(from.getLocationType())
				.setMarketId(from.getMarketId())
				.setModifiedHours(from.getModifiedHours().parallelStream().map(h -> hoursModifierConverter.toDto(h).orElse(null))
						.filter(b -> Objects.nonNull(b))
						.collect(Collectors.toSet()))
				.setName(from.getName())
				.setPhoneNumber(from.getPhoneNumber())
				.setPatios(from.getPatios().parallelStream().map(p -> patioConverter.toDto(p).orElse(null))
						.filter(b -> Objects.nonNull(b))
						.collect(Collectors.toSet()))
				.setPos(posConverter.toDto(from.getPos()).orElse(new FranchisePOSDto()))
				.setState(from.getState())
				.setZip(from.getZip());
		return Optional.of(to);
	}
	
	public Optional<FranchiseLocation> toEntity(FranchiseLocationDto from) {
		if(Objects.isNull(from)) {
			return Optional.empty();
		}
		FranchiseLocation to = repo.findByIdItemId(from.getId()).orElse(new FranchiseLocation())
				.setAddress1(from.getAddress1())
				.setAddress2(from.getAddress2())
				.setCity(from.getCity())
				.setConcept(from.getConcept())
				.setCountry(from.getCountry())
				.setGroupId(from.getGroupId())
				.setLocationType(from.getLocationType())
				.setMarketId(from.getMarketId())
				.setName(from.getName())
				.setPhoneNumber(from.getPhoneNumber())
				.setState(from.getState())
				.setZip(from.getZip());

		String itemId = null;
		if (Objects.nonNull(from.getId()) && !from.getId().isEmpty()) {
			itemId = from.getId();
		}
		if(Objects.isNull(to.getId())) {
			to.setId(new TenantedPrimaryKey());
		}
		to.getId().setItemId(itemId);
		
		Set<FranchiseBar> bars = from.getBars().parallelStream().map(b -> barConverter.toEntity(b).orElse(null))
				.filter(b -> Objects.nonNull(b))
				.collect(Collectors.toSet());

		FranchiseBuilding building = buildingConverter.toEntity(from.getBuilding()).orElse(new FranchiseBuilding());
		if (Objects.isNull(building.getId())) {
			building.setId(new TenantedPrimaryKey());
		}
		building.getId().setItemId(from.getId());

		FranchiseHoursOfOperation hours = hoursConverter.toEntity(from.getHours()).orElse(new FranchiseHoursOfOperation());
		if (Objects.isNull(hours.getId())) {
			hours.setId(new TenantedPrimaryKey());
		}
		hours.getId().setItemId(from.getId());

		FranchisePOS pos = posConverter.toEntity(from.getPos()).orElse(new FranchisePOS());
		if (Objects.isNull(pos.getId())) {
			pos.setId(new TenantedPrimaryKey());
		}
		pos.getId().setItemId(from.getId());
		
		Set<FranchiseHoursOfOperationModifier> modifiedHours = from.getModifiedHours().parallelStream()
				.map(h -> hoursModifierConverter.toEntity(h).orElse(null))
				.filter(h -> Objects.nonNull(h))
				.collect(Collectors.toSet());
		Set<FranchisePatio> patios = from.getPatios().parallelStream()
				.map(p -> patioConverter.toEntity(p).orElse(null))
				.filter(p -> Objects.nonNull(p))
				.collect(Collectors.toSet());
		
		to.setBars(bars).setBuilding(building).setHours(hours)
				.setModifiedHours(modifiedHours).setPatios(patios).setPos(pos);
		return Optional.of(to);
	}
}
