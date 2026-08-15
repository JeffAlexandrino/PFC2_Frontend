import { UserRole, UserRoleWithOrganization } from "./user-role";
import { MongoQuery, SubjectRawRule } from "@casl/ability";
import { Actions, FindParams, Role } from "./commom";

export type User = {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    ativo: boolean;
    bloqueado: boolean;
    createdAt: Date;
    updatedAt: Date;
    userRoles: Pick<
        UserRole,
        "id" | "role" | "bloqueado" | "ativo" | "userId" | "createdAt" | "updatedAt" | "empresaId" | "fixedCommission"
    >[];
};

export type NewUser = {
    name: string;
    email: string;
    role: Role;
};

export type DataUpdateUserInfo = { id: string; name: string; email: string; bloqueado: boolean };
export type DataUpdateUserRole = { userId: string; userRoles: { role: Role; fixedCommission?: boolean }[] };
export type ParamsUpdateOrDeleteUser = { onlyComercialNotManagerRoles?: "true" | "false" };

export type UserSession = {
    user: User;
    currentUserRole: UserRoleWithOrganization;
    regrasHabilidades: SubjectRawRule<Actions, any, MongoQuery>[];
};

//Where is used for filter params on client and new searches on server
export type UserWhere = {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    gte_updatedAt?: string;
    lte_updatedAt?: string;
    bloqueado?: string;
} & ParamsUpdateOrDeleteUser;

export type FindUserParams = FindParams<UserWhere, keyof User>;

export type GetUserReportWhereParams = {
    role?: string;
    gte_dataVenda: string;
    lte_dataVenda: string;
};

export type GetUserReportParams = FindParams<GetUserReportWhereParams, {}>;
