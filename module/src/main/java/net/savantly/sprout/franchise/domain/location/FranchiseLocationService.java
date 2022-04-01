package net.savantly.sprout.franchise.domain.location;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FranchiseLocationService {

	private final FranchiseLocationRepository repo;
	private final FranchiseLocationConverter locationConverter;

	public List<FranchiseLocationDto> getAll() {
		return repo.findAll().parallelStream().map(l -> toDto(l).orElse(null))
				.filter(b -> Objects.nonNull(b))
				.sorted(Comparator.comparing(FranchiseLocationDto::getName))
				.collect(Collectors.toList());
	}

	public FranchiseLocationDto upsertOne(FranchiseLocationDto dto) {
		// also adds the one-to-one entities if they weren't passed in
		FranchiseLocation tempEntity = toEntity(dto).orElseThrow(() -> new RuntimeException("couldnt construct entity from dto"));
		
		String itemId = tempEntity.getItemId();
		// If it's a new entity, let's pre-create the item id so we can use the same id for the one-to-one entities
		if (Objects.isNull(itemId)) {
			itemId = UUID.randomUUID().toString();
			tempEntity.getId().setItemId(itemId);
		}
		
		// make sure the one-to-one entities' item IDs match the location item id
		tempEntity.getBuilding().getId().setItemId(itemId);
		tempEntity.getPos().getId().setItemId(itemId);
		
		FranchiseLocation entity = this.repo.save(tempEntity);
		return toDto(entity).orElseThrow(() -> new RuntimeException("couldnt save entity from dto"));
	}

	public FranchiseLocationDto getByItemId(String uid) {
		FranchiseLocation entity = this.repo
				.findByIdItemId(uid).orElseThrow(() -> notFound(uid));
		return toDto(entity).orElseThrow(() -> new RuntimeException("couldnt construct dto from entity"));
	}

	private Optional<FranchiseLocation> toEntity(FranchiseLocationDto dto) {
		return locationConverter.toEntity(dto);
	}

	private Optional<FranchiseLocationDto> toDto(FranchiseLocation entity) {
		return locationConverter.toDto(entity);
	}

	private RuntimeException notFound(String id) {
		return new EntityNotFoundException("location with id: " + id + " not found");
	}
}
