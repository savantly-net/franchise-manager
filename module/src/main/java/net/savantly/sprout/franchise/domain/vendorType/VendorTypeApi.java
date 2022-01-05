package net.savantly.sprout.franchise.domain.vendorType;

import org.springframework.web.bind.annotation.RequestMapping;

import net.savantly.sprout.easy.EasyController;


@RequestMapping("/api/fm/vendor-type")
public class VendorTypeApi extends EasyController<VendorTypeDto, VendorTypeEntity, String, VendorTypeService, VendorTypeRepository> {

    public VendorTypeApi(VendorTypeService service) {
        super(service);
    }

    @Override
    protected String stringToID(String string) {
        return string;
    }
    
}
