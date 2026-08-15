import { EditUserByUserRoleData, EditUserRoleData, UserRole, UserRoleWhere } from "../types/user-role";
import { Role } from "../types/commom";

export default class UserRoleUtil {
    static readonly DEFAULT_LIMIT_PER_PAGE = 25;

    static readonly HIGH_ACCESS_ROLES = [Role.ADMIN, Role.FINANCIAL_MANAGER, Role.COMERCIAL_MANAGER];

    static readonly COMERCIAL_ROLES: Role[] = [
        Role.COMERCIAL_MANAGER,
        Role.REFERRER,
        Role.COMERCIAL_ASSISTANT,
        Role.SOLUTION_ARCHITECT,
        Role.VENDEDOR,
    ];

    public static getWhereToFindUserRoleFrom(searchParams: URLSearchParams): UserRoleWhere {
        return {
            user: searchParams.get("user") ?? undefined,
            role: searchParams.get("role") ?? undefined,
            gte_updatedAt: searchParams.get("gte_updatedAt") ?? undefined,
            lte_updatedAt: searchParams.get("lte_updatedAt") ?? undefined,
        };
    }

    public static getOnlyEditData(userRole: UserRole): EditUserRoleData {
        return {
            id: userRole.id,
            bloqueado: userRole.bloqueado,
        };
    }

    public static getOnlyEditUserData(userRole: UserRole): EditUserByUserRoleData {
        return {
            userRoleId: userRole.id,
            name: userRole.user.name,
            email: userRole.user.email,
            role: userRole.role,
        };
    }

    public static getRoleDescription(role: Role): string {
        switch (role) {
            case Role.ADMIN:
                return "Administrador";
            case Role.COMERCIAL_MANAGER:
                return "Gerente Comercial";
            case Role.COMMISSIONING_ANALYST:
                return "Analista de Comissão";
            case Role.VENDEDOR:
                return "Vendedor";
            case Role.COMERCIAL_ASSISTANT:
                return "SDR";
            case Role.SOLUTION_ARCHITECT:
                return "Arquiteto de Solução";
            case Role.REFERRER:
                return "Indicador Comercial";
            case Role.MONITOR:
                return "Monitor";
            case Role.FINANCIAL_MANAGER:
                return "Gerente Financeiro";
        }
    }

    public static hasComercialRole(roles: Role[]): boolean {
        return roles.some((role) => this.COMERCIAL_ROLES.includes(role));
    }

    public static hasOnlyComercialNotManagerRoles(userRoles: Role[]): boolean {
        return userRoles.every((role) => this.COMERCIAL_ROLES.includes(role) && role !== Role.COMERCIAL_MANAGER);
    }

    public static isComercialRole(role: Role): boolean {
        return this.COMERCIAL_ROLES.includes(role);
    }
}
