package net.savantly.sprout.franchise.domain.vendor;

import com.fasterxml.jackson.databind.util.Converter;

import net.savantly.sprout.easy.EasyService;

public class VendorService extends EasyService<VendorDto, VendorEntity, String, VendorRepository> {

    public VendorService(VendorRepository repository, Converter<VendorDto, VendorEntity> dtoConverter,
            Converter<VendorEntity, VendorDto> entityConverter) {
        super(repository, dtoConverter, entityConverter);
    }
    
}
