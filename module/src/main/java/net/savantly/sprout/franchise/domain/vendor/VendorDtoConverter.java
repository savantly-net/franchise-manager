package net.savantly.sprout.franchise.domain.vendor;

import com.fasterxml.jackson.databind.util.StdConverter;

public class VendorDtoConverter extends  StdConverter<VendorDto,VendorEntity> {

    @Override
    public VendorEntity convert(VendorDto value) {
        VendorEntity e = new VendorEntity()
            .setName(value.getName())
            .setMailingAddress(value.getMailingAddress())
            .setPhoneNumber(value.getPhoneNumber())
            .setTypeId(value.getTypeId())
            .setEmailAddress(value.getEmailAddress())
            .setNotes(value.getNotes());
        e.setId(value.getItemId());
        return e;
    }
    
}
