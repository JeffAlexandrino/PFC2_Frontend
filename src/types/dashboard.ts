import { IntervalDateEntity, Role } from "./commom";
import { SaleStatus } from "./sale";

export enum DashboardMetric {
    FATURAMENTO = "FATURAMENTO",
    VALOR_VENDA = "VALOR_VENDA",
    //MARGEM = "MARGEM",
    MARKUP_BRUTO = "MARKUP_BRUTO",
    MARKUP_LIQUIDO = "MARKUP_LIQUIDO",
    VISITA = "VISITA",
}
export type DashboardMetricKey = keyof typeof DashboardMetric;

export type DashboardWhere = {
    metrica: DashboardMetricKey;
    estadoVenda?: SaleStatus;
    userRoleId?: string;
    role: Role;
} & IntervalDateEntity;
