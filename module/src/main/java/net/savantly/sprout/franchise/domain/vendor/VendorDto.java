package net.savantly.sprout.franchise.domain.vendor;

import javax.validation.constraints.Size;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class VendorDto {
    
    @Size(max = 42)
    private String itemId;
    
    @Size(max = 255)
    private String name;
    @Size(max = 20)
    private String phoneNumber;
    @Size(max = 255)
    private String mailingAddress;
    @Size(max = 42)
    private String typeId;
    @Size(max = 255)
    private String emailAddress;
    @Size(max = 2000)
    private String notes;
}
