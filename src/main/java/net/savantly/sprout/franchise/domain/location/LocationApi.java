package net.savantly.sprout.franchise.domain.location;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import net.savantly.sprout.franchise.domain.fee.FranchiseFeeDto;
import net.savantly.sprout.franchise.domain.fee.FranchiseFeeService;
import net.savantly.sprout.franchise.domain.locationMember.FranchiseLocationMemberDto;
import net.savantly.sprout.franchise.domain.locationMember.FranchiseLocationMemberService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/fm/locations")
@PreAuthorize("hasAuthority('FM_LOCATION_ADMIN')")
public class LocationApi {

	private final FranchiseLocationService service;
	private final FranchiseLocationMemberService memberService;
	private final FranchiseFeeService feeService;

	@GetMapping
	@Operation(summary = "Get all the franchise locations")
	public List<FranchiseLocationDto> getAll() {
		return service.getAll();
	}

	@GetMapping("/{itemId}")
	@Operation(summary = "Get a franchise location by id")
	public FranchiseLocationDto getOneById(@PathVariable("itemId") String itemId) {
		return service.getByItemId(itemId);
	}

	@GetMapping("/{itemId}/fees")
	@Operation(summary = "Get a franchise location's fees")
	public ResponseEntity<List<FranchiseFeeDto>> getFeesById(@PathVariable("itemId") String itemId) {
		return ResponseEntity.ok(feeService.findByLocationId(itemId));
	}

	@GetMapping("/{itemId}/members")
	@Operation(summary = "Get a franchise location's members")
	public ResponseEntity<List<FranchiseLocationMemberDto>> getMembersById(@PathVariable("itemId") String itemId) {
		return ResponseEntity.ok(memberService.getMembers(itemId));
	}

	@PutMapping("/{itemId}/members")
	@Operation(summary = "Update a franchise location's members")
	public ResponseEntity<Void> updateMembersById(@PathVariable("itemId") String itemId,
			@RequestBody List<FranchiseLocationMemberDto> members) {
		memberService.updateMembers(itemId, members);
		return ResponseEntity.ok().build();
	}

	@PostMapping
	@Operation(summary = "Create a new location")
	public FranchiseLocationDto createOne(@RequestBody FranchiseLocationDto item) {
		return service.upsertOne(item);
	}

	@PostMapping("/{itemId}")
	@Operation(summary = "Update or create a new location by id")
	public FranchiseLocationDto upsertOne(@PathVariable("itemId") String itemId,
			@RequestBody FranchiseLocationDto item) {
		return service.upsertOne(item);
	}
}
