package net.savantly.sprout.franchise.domain.vendorType;

import com.fasterxml.jackson.databind.util.Converter;

import net.savantly.sprout.easy.EasyService;

public class VendorTypeService extends EasyService<VendorTypeDto, VendorTypeEntity, String, VendorTypeRepository> {

    public VendorTypeService(VendorTypeRepository repository, Converter<VendorTypeDto, VendorTypeEntity> dtoConverter,
            Converter<VendorTypeEntity, VendorTypeDto> entityConverter) {
        super(repository, dtoConverter, entityConverter);
    }
    
}
