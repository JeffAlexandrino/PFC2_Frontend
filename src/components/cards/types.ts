import { DashboardMetric } from "../../types/dashboard";
import { OrganizationTarget } from "../../types/organization-targets";
import { TargetType } from "../../types/target";

export type MetaDashboardCardProps = {
    metrica: DashboardMetric;
    metaAtingidaAtual: number;
    metaAtual: number;
    metaAtingidaAnterior: number;
    hideValues?: boolean;
};

export type MetaTotalEmpresa = {
    metaAtual: number;
    metaGlobalAnual?: number;
    metaAtingidaAtual: number;
    metaAtingidaAnterior: number;
    targets: OrganizationTarget[];
    targetTypeSelected?: TargetType;
    onTargetTypeSelected?: (targetType: TargetType) => void;
    onUpdateTargetEmpresa?: (metaGlobalAnual: number) => void;
    updatingTargetEmpresa?: boolean;
};

export type MetaTotalEmpresaDashboard = {
    targets: OrganizationTarget[];
    metrica: DashboardMetric;
    hideValues?: boolean;
    metaAtual: number;
    metaGlobalAnual?: number;
    metaAtingidaAtual: number;
    metaAtingidaAnterior: number;
};

export type TotalValueDashboardCardProps = {
    metrica: DashboardMetric;
    valoTotalAtual: number;
    valorTotalAnterior: number;
    hideValues?: boolean;
    valorGasto?: number;
};

export type TotalTicketDashboardCardProps = {
    metrica: DashboardMetric;
    valoTotalAtual: number;
    valorTotalAnterior: number;
    hideValues?: boolean;
};

export type MargemDashboardCardProps = {
    metrica: DashboardMetric;
    margemContribuicaoAtual: number;
    margemContribuicaoAnterior: number;
};

export type EvolucaoTotalDashboardProps = {
    metrica: DashboardMetric;
    anoAtual: {
        mesAno: string;
        valor: number;
    }[];
    anoAnterior: {
        mesAno: string;
        valor: number;
    }[];
};

export type EvolucaoTicketDashboardProps = {
    metrica: DashboardMetric;
    anoAtual: {
        mesAno: string;
        valorTicketMedio: number;
    }[];
    anoAnterior: {
        mesAno: string;
        valorTicketMedio: number;
    }[];
};
