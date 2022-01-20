package net.savantly.sprout.franchise.domain.vendorType;

import com.fasterxml.jackson.databind.util.StdConverter;

public class VendorTypeEntityConverter extends  StdConverter<VendorTypeEntity, VendorTypeDto>  {

    @Override
    public VendorTypeDto convert(VendorTypeEntity value) {
        VendorTypeDto e = new VendorTypeDto()
            .setName(value.getName());
        e.setItemId(value.getId());
        return e;
    }
    
}
