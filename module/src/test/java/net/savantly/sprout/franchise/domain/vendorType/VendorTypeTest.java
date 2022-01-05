package net.savantly.sprout.franchise.domain.vendorType;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;

import example.TestApplication;
import test.AbstractContainerBaseTest;

@ActiveProfiles("test")
@SpringBootTest(classes = TestApplication.class)
public class VendorTypeTest extends AbstractContainerBaseTest {

    @Autowired
    VendorTypeApi api;
    @Autowired
    VendorTypeDtoConverter dtoConverter;
    @Autowired
    VendorTypeEntityConverter entityConverter;
    @Autowired
    VendorTypePermissionEvaluator permissionEvaluator;
    @Autowired
    VendorTypeRepository repository;
    @Autowired
    VendorTypeService service;

    @Test
    @WithMockUser(authorities = {"FM_ADMIN"}, username = "fm admin")
    public void testCreate() {

        String id = "123";
        String name = "name";
        ResponseEntity<VendorTypeDto> response = api.create(new VendorTypeDto().setItemId(id).setName(name));
        Assertions.assertEquals(id, response.getBody().getItemId());
        Assertions.assertEquals(name, response.getBody().getName());
    }
    
}
