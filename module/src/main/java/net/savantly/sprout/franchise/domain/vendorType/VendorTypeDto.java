package net.savantly.sprout.franchise.domain.vendorType;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class VendorTypeDto {
    private String itemId;
    private String name;
}
