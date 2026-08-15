import UserRoleUtil from "../../../src/utils/user-role.util";

import { Role } from "../../../src/types/commom";

export default class TargetTestCases {
    public static viewCases = Object.values(Role).map((role) => ({ role, allowed: true }));

    public static manageCases = Object.values(Role).map((role) => ({
        role,
        possibilities: (UserRoleUtil.hasComercialRole([role])
            ? [role]
            : [Role.COMERCIAL_ASSISTANT, Role.COMERCIAL_MANAGER, Role.VENDEDOR]
        ).map((targetRole) => ({
            targetRole,
            allowed:
                role === Role.ADMIN ||
                (role === Role.COMERCIAL_MANAGER && UserRoleUtil.hasOnlyComercialNotManagerRoles([targetRole])),
        })),
    }));
}
