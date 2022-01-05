package net.savantly.sprout.franchise.domain.vendor;

import org.springframework.web.bind.annotation.RequestMapping;

import net.savantly.sprout.easy.EasyController;


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
