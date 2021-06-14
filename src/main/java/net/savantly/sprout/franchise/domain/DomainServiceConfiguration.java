package net.savantly.sprout.franchise.domain;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import net.savantly.sprout.franchise.domain.addressbook.AddressBookConfiguration;
import net.savantly.sprout.franchise.domain.bar.FranchiseBarConverter;
import net.savantly.sprout.franchise.domain.bar.FranchiseBarRepository;
import net.savantly.sprout.franchise.domain.building.FranchiseBuildingConverter;
import net.savantly.sprout.franchise.domain.building.FranchiseBuildingRepository;
import net.savantly.sprout.franchise.domain.calendar.CalendarApi;
import net.savantly.sprout.franchise.domain.calendar.CalendarItemRepository;
import net.savantly.sprout.franchise.domain.contact.FranchiseContactTypeApi;
import net.savantly.sprout.franchise.domain.contact.FranchiseContactTypeRepository;
import net.savantly.sprout.franchise.domain.fee.FranchiseFeeApi;
import net.savantly.sprout.franchise.domain.fee.FranchiseFeeRepository;
import net.savantly.sprout.franchise.domain.fee.FranchiseFeeService;
import net.savantly.sprout.franchise.domain.feeType.FeeTypeApi;
import net.savantly.sprout.franchise.domain.feeType.FranchiseFeeTypeRepository;
import net.savantly.sprout.franchise.domain.files.FranchiseFilesConfiguration;
import net.savantly.sprout.franchise.domain.group.FranchiseGroupRepository;
import net.savantly.sprout.franchise.domain.group.FranchiseGroupsApi;
import net.savantly.sprout.franchise.domain.groupMember.FranchiseGroupMemberApi;
import net.savantly.sprout.franchise.domain.groupMember.FranchiseGroupMemberRepository;
import net.savantly.sprout.franchise.domain.hours.FranchiseHoursOfOperationConverter;
import net.savantly.sprout.franchise.domain.hours.FranchiseHoursOfOperationModifierConverter;
import net.savantly.sprout.franchise.domain.hours.FranchiseHoursOfOperationModifierRepository;
import net.savantly.sprout.franchise.domain.hours.FranchiseHoursOfOperationRepository;
import net.savantly.sprout.franchise.domain.knowledge.KnowledgeApi;
import net.savantly.sprout.franchise.domain.knowledge.KnowledgeRepository;
import net.savantly.sprout.franchise.domain.location.FranchiseLocationConverter;
import net.savantly.sprout.franchise.domain.location.FranchiseLocationRepository;
import net.savantly.sprout.franchise.domain.location.FranchiseLocationService;
import net.savantly.sprout.franchise.domain.location.LocationApi;
import net.savantly.sprout.franchise.domain.locationMember.FranchiseLocationMemberRepository;
import net.savantly.sprout.franchise.domain.locationMember.FranchiseLocationMemberService;
import net.savantly.sprout.franchise.domain.market.FranchiseMarketRepository;
import net.savantly.sprout.franchise.domain.market.FranchiseMarketsApi;
import net.savantly.sprout.franchise.domain.newsletter.NewsletterApi;
import net.savantly.sprout.franchise.domain.newsletter.NewsletterRepository;
import net.savantly.sprout.franchise.domain.patio.FranchisePatioConverter;
import net.savantly.sprout.franchise.domain.patio.FranchisePatioRepository;
import net.savantly.sprout.franchise.domain.pos.FranchisePOSConverter;
import net.savantly.sprout.franchise.domain.pos.FranchisePOSRepository;
import net.savantly.sprout.franchise.domain.privilege.FMPrivilegeConfiguration;
import net.savantly.sprout.franchise.domain.report.ReportSourceConfiguration;
import net.savantly.sprout.franchise.domain.types.FMTypesApi;

@Configuration
@Import({ AddressBookConfiguration.class, 
		FMPrivilegeConfiguration.class, 
		FranchiseFilesConfiguration.class,
		ReportSourceConfiguration.class })
public class DomainServiceConfiguration {

	// APIs

	@Bean
	public CalendarApi franchiseCalendarApi(CalendarItemRepository repository) {
		return new CalendarApi(repository);
	}

	@Bean
	public FranchiseContactTypeApi franchiseContactTypeApi(FranchiseContactTypeRepository repository) {
		return new FranchiseContactTypeApi(repository);
	}

	@Bean
	public LocationApi franchiseLocationApi(FranchiseLocationService locationService,
			FranchiseLocationMemberService memberService, FranchiseFeeService feeService) {
		return new LocationApi(locationService, memberService, feeService);
	}

	@Bean
	public NewsletterApi franchiseNewsletterApi(NewsletterRepository repository) {
		return new NewsletterApi(repository);
	}

	@Bean
	public FMTypesApi fmTypesApi() {
		return new FMTypesApi();
	}

	@Bean
	public FranchiseMarketsApi fmMarketsApi(FranchiseMarketRepository repository) {
		return new FranchiseMarketsApi(repository);
	}

	@Bean
	public FranchiseGroupsApi franchiseGroupsApi(FranchiseGroupRepository repository) {
		return new FranchiseGroupsApi(repository);
	}

	@Bean
	public FranchiseGroupMemberApi franchiseGroupMemberApi(FranchiseGroupMemberRepository repository) {
		return new FranchiseGroupMemberApi(repository);
	}

	@Bean
	public FeeTypeApi franchiseFeeTypeApi(FranchiseFeeTypeRepository repository) {
		return new FeeTypeApi(repository);
	}

	@Bean
	public FranchiseFeeApi franchiseFeeApi(FranchiseFeeRepository repository, FranchiseFeeService service) {
		return new FranchiseFeeApi(repository, service);
	}

	@Bean
	public KnowledgeApi knowledgeApi(KnowledgeRepository repository) {
		return new KnowledgeApi(repository);
	}

	// Services
	@Bean
	public FranchiseLocationService franchiseLocationService(FranchiseLocationRepository repo,
			FranchiseLocationConverter locationConverter) {
		return new FranchiseLocationService(repo, locationConverter);
	}

	// Converter

	@Bean
	public FranchiseBarConverter barConverter(FranchiseBarRepository repo) {
		return new FranchiseBarConverter(repo);
	}

	@Bean
	public FranchiseBuildingConverter buildingConverter(FranchiseBuildingRepository repo) {
		return new FranchiseBuildingConverter(repo);
	}

	@Bean
	public FranchiseLocationConverter locationConverter(FranchiseBarConverter barConverter,
			FranchiseBuildingConverter buildingConverter, FranchiseHoursOfOperationConverter hoursConverter,
			FranchiseHoursOfOperationModifierConverter hoursModifierConverter, FranchisePatioConverter patioConverter,
			FranchisePOSConverter posConverter, FranchiseLocationRepository repo) {
		return new FranchiseLocationConverter(repo, barConverter, buildingConverter, hoursConverter,
				hoursModifierConverter, patioConverter, posConverter);

	}

	@Bean
	public FranchiseFeeService franchiseFeeService(FranchiseFeeRepository repository,
			FranchiseFeeTypeRepository feeTypes) {
		return new FranchiseFeeService(repository, feeTypes);
	}

	@Bean
	public FranchiseHoursOfOperationConverter hoursConverter(FranchiseHoursOfOperationRepository repo) {
		return new FranchiseHoursOfOperationConverter(repo);
	}

	@Bean
	public FranchiseHoursOfOperationModifierConverter hoursModifierConverter(
			FranchiseHoursOfOperationModifierRepository repo) {
		return new FranchiseHoursOfOperationModifierConverter(repo);
	}

	@Bean
	public FranchisePatioConverter patioConverter(FranchisePatioRepository repo) {
		return new FranchisePatioConverter(repo);
	}

	@Bean
	public FranchisePOSConverter posConverter(FranchisePOSRepository repo) {
		return new FranchisePOSConverter(repo);
	}

	@Bean
	public FranchiseLocationMemberService franchiseLocationMemberService(FranchiseLocationMemberRepository repo) {
		return new FranchiseLocationMemberService(repo);
	}

}
