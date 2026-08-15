import {
    rolesThatCanManageAnyCommission,
    rolesThatCanViewAnyCommission,
} from "../../support/roles-permissions.support";
import { Role } from "../../../src/types/commom";

import UserRoleUtil from "../../../src/utils/user-role.util";

export default class CommissionTestCases {
    public static viewFilteredByUserCases = Object.values(Role).map((role) => ({
        role,
        possibilities: UserRoleUtil.COMERCIAL_ROLES.map((userRole) => ({
            userRole,
            allowedViewAll: rolesThatCanViewAnyCommission.includes(role),
            allowedViewFiltered: role === userRole,
        })),
    }));

    public static viewAuditCases = Object.values(Role).map((role) => ({ role, allowed: true }));

    public static viewSupplierPayCases = Object.values(Role).map((role) => ({
        role,
        allowed: rolesThatCanManageAnyCommission.includes(role),
    }));

    public static viewApproveCases = Object.values(Role).map((role) => ({
        role,
        allowed: rolesThatCanManageAnyCommission.includes(role),
    }));

    public static viewMarkAsPaidCases = Object.values(Role).map((role) => ({
        role,
        allowed: rolesThatCanManageAnyCommission.includes(role),
    }));
}
