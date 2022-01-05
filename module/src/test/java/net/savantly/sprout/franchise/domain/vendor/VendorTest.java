package net.savantly.sprout.franchise.domain.vendor;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;

import example.TestApplication;
import test.AbstractContainerBaseTest;

@ActiveProfiles("test")
@SpringBootTest(classes = TestApplication.class)
public class VendorTest extends AbstractContainerBaseTest {

    @Autowired
    VendorApi api;

    @Test
    @WithMockUser(authorities = {"FM_ADMIN"}, username = "fm admin")
    public void testCreate() {

        String id = "123";
        String name = "name";
        String typeId = "234";
        ResponseEntity<VendorDto> response = api.create(new VendorDto()
            .setItemId(id)
            .setName(name)
            .setTypeId(typeId));
        Assertions.assertEquals(id, response.getBody().getItemId());
        Assertions.assertEquals(name, response.getBody().getName());
    }
    
}
