package net.savantly.sprout.franchise.domain.vendorType;

import com.fasterxml.jackson.databind.util.StdConverter;

public class VendorTypeDtoConverter extends  StdConverter<VendorTypeDto,VendorTypeEntity> {

    @Override
    public VendorTypeEntity convert(VendorTypeDto value) {
        VendorTypeEntity e = new VendorTypeEntity()
            .setName(value.getName());
        e.setId(value.getItemId());
        return e;
    }
    
}
