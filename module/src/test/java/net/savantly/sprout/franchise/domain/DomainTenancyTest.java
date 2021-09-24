package net.savantly.sprout.franchise.domain;

import java.io.Serializable;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.wait.strategy.HostPortWaitStrategy;

import net.savantly.sprout.core.domain.tenant.TenantSupport;
import net.savantly.sprout.core.tenancy.TenantContext;
import net.savantly.sprout.core.tenancy.TenantedJpaRepository;
import net.savantly.sprout.franchise.FranchiseManagerModule;
import net.savantly.sprout.franchise.IntegrationTest;
import net.savantly.sprout.franchise.domain.bar.FranchiseBar;
import net.savantly.sprout.franchise.domain.bar.FranchiseBarRepository;
import net.savantly.sprout.franchise.domain.building.FranchiseBuilding;
import net.savantly.sprout.franchise.domain.building.FranchiseBuildingRepository;
import net.savantly.sprout.franchise.domain.contact.FranchiseContactType;
import net.savantly.sprout.franchise.domain.contact.FranchiseContactTypeRepository;
import net.savantly.sprout.franchise.domain.fee.FranchiseFee;
import net.savantly.sprout.franchise.domain.fee.FranchiseFeeRepository;
import net.savantly.sprout.franchise.domain.feeType.FranchiseFeeType;
import net.savantly.sprout.franchise.domain.feeType.FranchiseFeeTypeRepository;
import net.savantly.sprout.franchise.domain.group.FranchiseGroup;
import net.savantly.sprout.franchise.domain.group.FranchiseGroupRepository;
import net.savantly.sprout.franchise.domain.integration.FranchiseIntegrationType;
import net.savantly.sprout.franchise.domain.integration.FranchiseIntegrationTypeRepository;
import net.savantly.sprout.franchise.domain.location.FranchiseLocation;
import net.savantly.sprout.franchise.domain.location.FranchiseLocationRepository;
import net.savantly.sprout.franchise.domain.market.FranchiseMarket;
import net.savantly.sprout.franchise.domain.market.FranchiseMarketRepository;
import net.savantly.sprout.franchise.domain.ownership.FranchiseOwnership;
import net.savantly.sprout.franchise.domain.ownership.FranchiseOwnershipRepository;
import net.savantly.sprout.franchise.domain.patio.FranchisePatio;
import net.savantly.sprout.franchise.domain.patio.FranchisePatioRepository;
import net.savantly.sprout.franchise.domain.pos.FranchisePOS;
import net.savantly.sprout.franchise.domain.pos.FranchisePOSRepository;

@IntegrationTest
@ActiveProfiles("test")
public class DomainTenancyTest {

	protected static String dbName = "bar";
	protected static String username = "it_user";
	protected static String password = "it_pass";

	static final PostgreSQLContainer DB_CONTAINER = (PostgreSQLContainer) new PostgreSQLContainer()
			.withDatabaseName(dbName)
			.withUsername(username)
			.withPassword(password)
			.withReuse(true)
			.waitingFor(new HostPortWaitStrategy());;

	static {
		DB_CONTAINER.start();
	}
	
	@AfterAll
	static void afterAll() {
		
	}

	@DynamicPropertySource
	static void properties(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", DB_CONTAINER::getJdbcUrl);
		registry.add("spring.datasource.username", () -> username);
		registry.add("spring.datasource.password", () -> password);
		registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
	}
	
	@Autowired
	FranchiseBarRepository barRepo;
	@Autowired
	FranchiseBuildingRepository buildingRepo;
	@Autowired
	FranchiseContactTypeRepository contactRepo;
	@Autowired
	FranchiseFeeRepository feeRepo;
	@Autowired
	FranchiseFeeTypeRepository feeTypeRepo;
	@Autowired
	FranchiseGroupRepository groupRepo;
	@Autowired
	FranchiseIntegrationTypeRepository integrationRepo;
	@Autowired
	FranchiseLocationRepository locationRepo;
	@Autowired
	FranchiseMarketRepository marketRepo;
	@Autowired
	FranchiseOwnershipRepository ownershipRepo;
	@Autowired
	FranchisePatioRepository patioRepo;
	@Autowired
	FranchisePOSRepository posRepo;
	
	@Autowired
	FranchiseManagerModule module;
	
	@Test
	public void barTest() {
		doAssertions(new FranchiseBar(), new FranchiseBar(), (TenantedJpaRepository)this.barRepo);
	}
	@Test
	public void buildingTest() {
		doAssertions(new FranchiseBuilding(), new FranchiseBuilding(), (TenantedJpaRepository)this.buildingRepo);
	}
	@Test
	public void franchiseContactTest() {
		doAssertions(new FranchiseContactType(), new FranchiseContactType(), (TenantedJpaRepository)this.contactRepo);
	}
	@Test
	public void feeTest() {
		doAssertions(new FranchiseFee(), new FranchiseFee(), (TenantedJpaRepository)this.feeRepo);
	}
	@Test
	public void feeTypeTest() {
		doAssertions(new FranchiseFeeType(), new FranchiseFeeType(), (TenantedJpaRepository)this.feeTypeRepo);
	}
	@Test
	public void groupTest() {
		doAssertions(new FranchiseGroup(), new FranchiseGroup(), (TenantedJpaRepository)this.groupRepo);
	}
	@Test
	public void intTest() {
		doAssertions(new FranchiseIntegrationType(), new FranchiseIntegrationType(), (TenantedJpaRepository)this.integrationRepo);
	}
	@Test
	public void locationTest() {
		doAssertions(new FranchiseLocation(), new FranchiseLocation(), (TenantedJpaRepository)this.locationRepo);
	}
	@Test
	public void marketTest() {
		doAssertions(new FranchiseMarket(), new FranchiseMarket(), (TenantedJpaRepository)this.marketRepo);
	}
	@Test
	public void ownershipTest() {
		doAssertions(new FranchiseOwnership(), new FranchiseOwnership(), (TenantedJpaRepository)this.ownershipRepo);
	}
	@Test
	public void patioTest() {
		doAssertions(new FranchisePatio(), new FranchisePatio(), (TenantedJpaRepository)this.patioRepo);
	}
	@Test
	public void posTest() {
		doAssertions(new FranchisePOS(), new FranchisePOS(), (TenantedJpaRepository)this.posRepo);
	}
	

	private <T extends TenantSupport, R extends TenantedJpaRepository<T, Serializable>> void doAssertions(T entity1, T entity2, R repo) {

		String defaultTenant = "sprout";
		
		TenantSupport defaultTenantEntity = repo.save(entity1);
		Assertions.assertEquals(defaultTenant, defaultTenantEntity.getTenantId());

		Assertions.assertEquals(1, repo.findAll().size(), "There should be one item using " + defaultTenant);
		
		// CHANGE TENANTS
		String tenantX = "tenant-x";
		TenantContext.setCurrentTenant(tenantX);
		Assertions.assertEquals(0, repo.findAll().size(), "There should be no results since we are using a different tenant");
		
		TenantSupport tenantXEntity = repo.save(entity2);
		Assertions.assertEquals(tenantX, entity2.getTenantId());

		Assertions.assertEquals(1, repo.findAll().size(), "There should be one item using " + tenantX);

		TenantContext.clear();
		
	}
	
}
