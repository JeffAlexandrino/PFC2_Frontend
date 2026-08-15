import { FindParams, Role } from "./commom";
import { UserRole } from "./user-role";

export type RoleCommission = {
    id: string;
    comissao: number;
    acelerator: number;
    createdAt: Date;
    updatedAt: Date;
    userRoleId: string;
    userRole: UserRole;
    distribuicaoComissaoId: string;
};

export type NewRoleCommission = Pick<RoleCommission, "comissao" | "userRoleId" | "acelerator">;

export type CommissionDistribution = {
    id: string;
    empresaId: string | null;
    createdAt: Date;
    updatedAt: Date;
    roleCommissions: RoleCommission[];
};

export type NewCommissionDistribution = {
    roleCommissions: Pick<RoleCommission, "comissao" | "userRoleId" | "acelerator">[];
};
export type EditCommissionDistributionData = Pick<NewCommissionDistribution, "roleCommissions"> &
    Pick<CommissionDistribution, "id">;

export type CommissionDistributionWhere = { userRoleId?: string; role?: Role };
export type CommissionDistributionSortBy = Pick<CommissionDistribution, "createdAt">;

export type CommissionDistributionQueryProps = FindParams<CommissionDistributionWhere, CommissionDistributionSortBy>;
