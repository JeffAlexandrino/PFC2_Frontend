import {
    EDITABLE_ROLES_BY_MANAGER,
    rolesWithTargets,
    rolesThatCanManageAnyUser,
    rolesThatCanManageComercialUser,
    rolesThatCanViewAnyUser,
    rolesThatCanViewAnyUserTarget,
} from "../../support/roles-permissions.support";
import { Role } from "../../../src/types/commom";

import FixtureSupport from "../../support/fixture.support";

export default class UserTestCases {
    public static viewCases = Object.values(Role).map((role) => ({
        role,
        allowed: rolesThatCanViewAnyUser.includes(role),
    }));

    public static createCases = Object.values(Role).map((role) => ({
        role,
        isOptionVisible: rolesThatCanManageComercialUser.includes(role),
    }));

    public static auditCases = Object.values(Role).map((role) => ({
        role,
        possibilities: Object.values(Role).map((roleOfUserToAudit) => ({
            userId: FixtureSupport.getInfoFromUserBy(roleOfUserToAudit).id,
            isOptionVisible: rolesThatCanViewAnyUser.includes(role),
        })),
    }));

    public static updateUserRolesCases = Object.values(Role).map((role) => ({
        role,
        possibilities: Object.values(Role).map((userToUpdateRole) => ({
            userId: FixtureSupport.getInfoFromUserBy(userToUpdateRole).id,
            isOptionVisible:
                rolesThatCanManageAnyUser.includes(role) ||
                (role === Role.COMERCIAL_MANAGER && EDITABLE_ROLES_BY_MANAGER.includes(userToUpdateRole)),
        })),
    }));

    public static viewTargetsCases = Object.values(Role).map((role) => ({
        role,
        possibilities: Object.values(Role).map((roleOfUserToViewTargets) => ({
            userId: FixtureSupport.getInfoFromUserBy(roleOfUserToViewTargets).id,
            isOptionVisible:
                rolesWithTargets.includes(roleOfUserToViewTargets) &&
                (role === roleOfUserToViewTargets ||
                    rolesThatCanViewAnyUserTarget.includes(role) ||
                    (role === Role.COMERCIAL_MANAGER && EDITABLE_ROLES_BY_MANAGER.includes(roleOfUserToViewTargets))),
        })),
    }));

    public static updateOrDeleteUserInfoCases = Object.values(Role).map((role) => ({
        role,
        possibilities: Object.values(Role).map((roleOfUserToViewTargets) => ({
            userId: FixtureSupport.getInfoFromUserBy(roleOfUserToViewTargets).id,
            isOptionVisible:
                rolesThatCanManageAnyUser.includes(role) ||
                (role === Role.COMERCIAL_MANAGER && EDITABLE_ROLES_BY_MANAGER.includes(roleOfUserToViewTargets)),
        })),
    }));
}
