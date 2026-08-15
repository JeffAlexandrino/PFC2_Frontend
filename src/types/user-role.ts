import { Organization } from "./organization";
import { FindParams, Role } from "./commom";
import { User } from "./user";

export type NewUserRole = Pick<User, "name" | "email"> & Pick<UserRole, "role">;
export type UserRole = {
    ativo: boolean;
    bloqueado: boolean;
    createdAt: Date;
    empresaId: string;
    id: string;
    role: Role;
    fixedCommission: boolean;
    updatedAt: Date;
    userId: string;
    user: Pick<User, "id" | "email" | "ativo" | "bloqueado" | "name" | "isEmailVerified" | "createdAt" | "updatedAt">;
};

export type UserRoleWithOrganization = UserRole & { empresa: Omit<Organization, "userRoles"> };

export type UserRoleWhere = {
    id?: string;
    user?: string;
    role?: string;
    gte_updatedAt?: string;
    lte_updatedAt?: string;
};

export type FindUserRoleParams = FindParams<UserRoleWhere, keyof UserRole>;

export type EditUserRoleData = Pick<UserRole, "id" | "bloqueado">;
export type EditUserByUserRoleData = Pick<User, "name" | "email"> & Pick<UserRole, "role"> & { userRoleId: string };
