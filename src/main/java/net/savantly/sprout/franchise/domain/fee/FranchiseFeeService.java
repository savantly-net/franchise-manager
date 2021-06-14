package net.savantly.sprout.franchise.domain.fee;

import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.web.bind.annotation.RequestBody;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.franchise.domain.feeType.FranchiseFeeType;
import net.savantly.sprout.franchise.domain.feeType.FranchiseFeeTypeRepository;

@RequiredArgsConstructor
public class FranchiseFeeService {

	private final FranchiseFeeRepository repository;
	private final FranchiseFeeTypeRepository feeTypes;
	
	public void bulkImport(@RequestBody List<FranchiseFeeDto> fees) {
		for (FranchiseFeeDto franchiseFeeDto : fees) {
			this.repository.save(createEntity(franchiseFeeDto));
		}
	}

	protected FranchiseFeeDto convert(FranchiseFee object) {
		return new FranchiseFeeDto()
				.setItemId(object.getItemId())
				.setEndDate(object.getEndDate())
				.setFeeTypeId(object.getFeeType().getItemId())
				.setLocationId(object.getLocationId())
				.setStoreId(object.getStoreId())
				.setOverrideAmount(object.getOverrideAmount())
				.setStartDate(object.getStartDate())
				.setAmount(object.getAmount())
				.setHasCustomAmount(object.hasCustomAmount());
	}

	private FranchiseFeeType getFeeType(String feeTypeId) {
		return feeTypes.findByIdItemId(feeTypeId).orElseThrow(() -> new EntityNotFoundException("fee type not found " + feeTypeId));
	}

	protected FranchiseFee createEntity(FranchiseFeeDto object) {
		return this.repository.findByIdItemId(object.getItemId()).orElse(new FranchiseFee()
				.setEndDate(object.getEndDate())
				.setFeeType(getFeeType(object.getFeeTypeId()))
				.setLocationId(object.getLocationId())
				.setStoreId(object.getStoreId())
				.setOverrideAmount(object.getOverrideAmount())
				.setStartDate(object.getStartDate()));
	}

	protected FranchiseFee updateEntity(FranchiseFee entity, FranchiseFeeDto object) {
		return entity
				.setEndDate(object.getEndDate())
				.setFeeType(getFeeType(object.getFeeTypeId()))
				.setLocationId(object.getLocationId())
				.setOverrideAmount(object.getOverrideAmount())
				.setStartDate(object.getStartDate());
	}

	public List<FranchiseFeeDto> findByLocationId(String locationId) {
		return this.repository.findByLocationId(locationId).stream().map(i -> convert(i)).collect(Collectors.toList());
	}
	
}
