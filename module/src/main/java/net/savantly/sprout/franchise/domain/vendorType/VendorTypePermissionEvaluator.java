package net.savantly.sprout.franchise.domain.vendorType;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

import org.springframework.security.core.Authentication;

import net.savantly.sprout.core.security.permissions.Permission;
import net.savantly.sprout.core.security.permissions.SproutPermissionEvaluator;
import net.savantly.sprout.franchise.domain.privilege.FMPrivilege;

public class VendorTypePermissionEvaluator implements SproutPermissionEvaluator<VendorTypeDto> {

    @Override
    public List<String> getEvaluationType() {
        return Arrays.asList(VendorTypeDto.class.getName());
    }

    @Override
    public boolean hasPermission(Authentication auth, VendorTypeDto dto, Permission permission) {
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().contentEquals("ADMIN") || a.getAuthority().contentEquals(FMPrivilege.FM_ADMIN));
        switch (permission) {
            case READ:
                return true;
            case CREATE:
            case DELETE:
            case UPDATE:
            return isAdmin;
        }
        return false;
    }

    @Override
    public boolean hasPermission(Authentication auth, Serializable object, String id, Permission permission) {
        return false;
    }
    
}