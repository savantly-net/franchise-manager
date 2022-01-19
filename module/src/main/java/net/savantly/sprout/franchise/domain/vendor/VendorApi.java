package net.savantly.sprout.franchise.domain.vendor;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.easy.EasyController;

@RestController
@RequestMapping("/api/fm/vendor")
public class VendorApi extends EasyController<VendorDto, VendorEntity, String, VendorService, VendorRepository> {

    public VendorApi(VendorService service) {
        super(service);
    }

    @Override
    protected String stringToID(String string) {
        return string;
    }
    
}
