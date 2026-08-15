import { FindParams } from "./commom";
import { TargetType } from "./target";

export type OrganizationTargetTypeValue = {
    tipoMeta: TargetType;
    valorMeta: number;
    valorAtual: number;
};

export type OrganizationTarget = {
    id: string;
    dataInicioMeta: Date;
    dataFimMeta: Date;
    empresaid: string;
    createdAt: Date;
    updatedAt: Date;
    tiposMeta: OrganizationTargetTypeValue[];
};

export type NewOrganizationTargetTypeValue = Pick<OrganizationTargetTypeValue, "valorMeta" | "tipoMeta">;
export type NewOrganizationTarget = Pick<OrganizationTarget, "dataInicioMeta" | "dataFimMeta"> & {
    tiposMeta: NewOrganizationTargetTypeValue[];
};
export type DataUpdateOrganizationTarget = Pick<OrganizationTarget, "id"> & NewOrganizationTarget;

export type OrganizationTargetWhere = { dataInicioMeta: string | Date; dataFimMeta: string | Date };
export type OrganizationTargetSortBy = Pick<OrganizationTarget, "dataInicioMeta" | "dataFimMeta">;

export type OrganizationTargetQueryProps = FindParams<OrganizationTargetWhere, OrganizationTargetSortBy>;
