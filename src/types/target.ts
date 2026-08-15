import { FindParams, Role } from "./commom";
import { UserRole } from "./user-role";
import { Sale } from "./sale";

export enum TargetType {
    FATURAMENTO = "FATURAMENTO",
    VALOR_VENDA = "VALOR_VENDA",
    MARGEM = "MARGEM",
    MARKUP_BRUTO = "MARKUP_BRUTO",
    MARKUP_LIQUIDO = "MARKUP_LIQUIDO",
    VISITA = "VISITA",
}

export type TargetTypeValue = {
    tipoMeta: TargetType;
    aceleratorTriggerValue: number;
    commissionTriggerValue: number;
    valorAtingido: number;
};

export type Target = {
    id: string;
    dataInicioMeta: Date;
    dataFimMeta: Date;

    userRoleId: string;
    userRole: Omit<UserRole, "user">;
    createdAt: Date;
    updatedAt: Date;
    tiposMeta: TargetTypeValue[];
};

export type NewTargetTypeValue = Pick<
    TargetTypeValue,
    "commissionTriggerValue" | "aceleratorTriggerValue" | "tipoMeta"
>;
export type NewTarget = Pick<Target, "dataInicioMeta" | "dataFimMeta" | "userRoleId"> & {
    tiposMeta: NewTargetTypeValue[];
};
export type DataUpdateTarget = Pick<Target, "id"> & NewTarget;

export type ParamsUpdateTarget = Pick<TargetWhere, "userRole">;
export type ParamsCreateTarget = Pick<TargetWhere, "userRole">;
export type ParamsDeleteTarget = Pick<TargetWhere, "userRole">;

export type TargetWhere = Partial<
    Pick<Target, "userRoleId" | "dataFimMeta" | "dataInicioMeta"> &
        Pick<Sale, "estadoVenda" | "vendaRenovacao"> & { userRole?: Role }
>;
export type TargetSortBy = Pick<Target, "dataInicioMeta" | "dataFimMeta" | "userRoleId">;
export type TargetQueryProps = FindParams<TargetWhere, TargetSortBy>;

export type SaleTargetBySalePerson = {
    vendaId: string;
    userRoleId: string;
    percentContribuicaoMeta: number;
};
