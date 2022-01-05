package net.savantly.sprout.franchise.domain.vendor;

import com.fasterxml.jackson.databind.util.StdConverter;

public class VendorEntityConverter extends  StdConverter<VendorEntity, VendorDto>  {

    @Override
    public VendorDto convert(VendorEntity value) {
        VendorDto d = new VendorDto()
            .setName(value.getName())
            .setMailingAddress(value.getMailingAddress())
            .setPhoneNumber(value.getPhoneNumber())
            .setTypeId(value.getTypeId())
            .setEmailAddress(value.getEmailAddress())
            .setNotes(value.getNotes());
        d.setItemId(value.getId());
        return d;
    }
    
}
