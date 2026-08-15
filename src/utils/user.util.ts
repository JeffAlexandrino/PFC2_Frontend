import { DataUpdateUserInfo, DataUpdateUserRole, User, UserWhere } from "../types/user";
import { GTE_PREFIX, LTE_PREFIX } from "../hooks/use-onchange-filter";

export default class UserUtil {
    static DEFAULT_LIMIT_PER_PAGE = 25;
    //filter params constants
    static NAME_KEY = "name";
    static EMAIL_KEY = "email";
    static ROLE_KEY = "role";
    static UPDATED_AT_KEY = "updatedAt";
    static BLOCKED_KEY = "bloqueado";
    static GTE_UPDATED_AT_KEY = GTE_PREFIX + this.UPDATED_AT_KEY;
    static LTE_UPDATED_AT_KEY = LTE_PREFIX + this.UPDATED_AT_KEY;

    //get the filter param of the column filtered, Ex: -> role <- ?=ADMIN
    public static getWhereParamsBy(searchParams: URLSearchParams): UserWhere {
        return {
            name: searchParams.get(this.NAME_KEY) ?? undefined,
            email: searchParams.get(this.EMAIL_KEY) ?? undefined,
            role: searchParams.get(this.ROLE_KEY) ?? undefined,
            gte_updatedAt: searchParams.get(this.GTE_UPDATED_AT_KEY) ?? undefined,
            lte_updatedAt: searchParams.get(this.LTE_UPDATED_AT_KEY) ?? undefined,
            bloqueado: searchParams.get(this.BLOCKED_KEY) ?? undefined,
        };
    }

    //get the filter values of the column filtered, Ex: role?= -> ADMIN <-
    public static getFilterValuesBy(searchParams: URLSearchParams) {
        const gteUpdatedAt = searchParams.get(this.GTE_UPDATED_AT_KEY);
        const lteUpdatedAt = searchParams.get(this.LTE_UPDATED_AT_KEY);

        return {
            name: searchParams.get(this.NAME_KEY) ?? undefined,
            email: searchParams.get(this.EMAIL_KEY) ?? undefined,
            role: searchParams.get(this.ROLE_KEY) ?? undefined,
            updatedAt: gteUpdatedAt && lteUpdatedAt ? { gte: gteUpdatedAt, lte: lteUpdatedAt } : undefined,
            bloqueado: searchParams.get(this.BLOCKED_KEY) ?? undefined,
        };
    }

    //Only take and show this user Data in the EditUserForm
    public static getOnlyEditData<T extends DataUpdateUserInfo>(user: T): DataUpdateUserInfo {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            bloqueado: user.bloqueado,
        };
    }

    public static getManageUserRoleData(user: User): DataUpdateUserRole {
        return {
            userId: user.id,
            userRoles: user.userRoles.map(({ role, fixedCommission }) => ({ role, fixedCommission })),
        };
    }
}
