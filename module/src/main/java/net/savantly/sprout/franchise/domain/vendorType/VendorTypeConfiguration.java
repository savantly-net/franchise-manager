package net.savantly.sprout.franchise.domain.vendorType;

import com.fasterxml.jackson.databind.util.Converter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VendorTypeConfiguration {

    @Bean
    public VendorTypeApi vendorTypeApi(VendorTypeService service) {
        return new VendorTypeApi(service);
    }
    
    @Bean
    public VendorTypeService vendorTypeService(
            VendorTypeRepository repository, 
            Converter<VendorTypeDto, VendorTypeEntity> dtoConverter, 
            Converter<VendorTypeEntity, VendorTypeDto> entityConverter){
        return new VendorTypeService(repository, dtoConverter, entityConverter);
    }

    @Bean
    public Converter<VendorTypeDto, VendorTypeEntity> vendorTypeDtoConverter() {
        return new VendorTypeDtoConverter();
    }

    @Bean
    public Converter<VendorTypeEntity, VendorTypeDto> vendorTypeEntityConverter() {
        return new VendorTypeEntityConverter();
    }

    @Bean
    public VendorTypePermissionEvaluator vendorTypePermissionEvaluator() {
        return new VendorTypePermissionEvaluator();
    }
}
