package net.savantly.sprout.franchise.domain.vendor;

import com.fasterxml.jackson.databind.util.Converter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VendorConfiguration {

    @Bean
    public VendorApi vendorApi(VendorService service) {
        return new VendorApi(service);
    }
    
    @Bean
    public VendorService vendorService(
            VendorRepository repository, 
            Converter<VendorDto, VendorEntity> dtoConverter, 
            Converter<VendorEntity, VendorDto> entityConverter){
        return new VendorService(repository, dtoConverter, entityConverter);
    }

    @Bean
    public Converter<VendorDto, VendorEntity> vendorDtoConverter() {
        return new VendorDtoConverter();
    }

    @Bean
    public Converter<VendorEntity, VendorDto> vendorEntityConverter() {
        return new VendorEntityConverter();
    }
    
    @Bean
    public VendorPermissionEvaluator vendorPermissionEvaluator() {
        return new VendorPermissionEvaluator();
    }
}
