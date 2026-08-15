import { UserRole } from "./user-role";
import { FindParams } from "./commom";
import { Customer } from "./customer";

export enum ExpenseType {
    COMBUSTIVEL = "COMBUSTIVEL",
    VIAGEM = "VIAGEM",
    HOSPEDAGEM = "HOSPEDAGEM",
    ESTACIONAMENTO = "ESTACIONAMENTO",
    PEDAGIO = "PEDAGIO",
    ALMOCO = "ALMOCO",
    JANTA = "JANTA",
    ALIMENTACAO = "ALIMENTACAO",
    COFFE = "COFFE",
}

export enum TravelType {
    ONIBUS = "ONIBUS",
    AVIAO = "AVIAO",
    TREM = "TREM",
}

export enum VisitType {
    VISITA = "VISITA",
    REUNIAO = "REUNIAO",
    SUPORTE = "SUPORTE",
    TREINAMENTO = "TREINAMENTO",
    WEBINAR = "WEBINAR",
    WORKSHOP = "WORKSHOP",
}

export type VisitExpense = {
    id: string;
    nota: string | null;
    visitaId?: string;
    valor: number;
    updatedAt: string;
    createdAt: Date;
    tipoGasto: ExpenseType;
    tipoViagem?: TravelType | null;
    dataViagem?: Date | null;
    carroEmpresa?: boolean;
    kmInicial?: number;
    kmFinal?: number;
};

export type Visit = {
    clienteId: string;
    comentarios: string | null;
    createdAt: Date;
    dataVisita: Date;
    empresaId: string;
    gastos: VisitExpense[];
    id: string;
    kmFinal: number | undefined | null;
    kmInicial: number | undefined | null;
    carroEmpresa: boolean | undefined | null;
    remoto: boolean;
    updatedAt: Date;
    salePerson: UserRole;
    salePersonId: string;
    visitaPaga: boolean;
    cliente: Customer;
    tipoVisita?: VisitType | null;
};

export type NewVisitExpense = Omit<VisitExpense, "id" | "updatedAt" | "createdAt" | "visitaId">;
export type UpdateVisitExpense = Omit<VisitExpense, "id" | "updatedAt" | "createdAt" | "visitaId">;

export type NewVisit = Pick<
    Visit,
    "dataVisita" | "comentarios" | "remoto" | "salePersonId" | "clienteId" | "visitaPaga" | "tipoVisita"
> & {
    gastos: NewVisitExpense[];
};

export type EditVisit = Pick<
    Visit,
    | "clienteId"
    | "salePersonId"
    | "comentarios"
    | "remoto"
    | "visitaPaga"
    | "carroEmpresa"
    | "kmInicial"
    | "kmFinal"
    | "dataVisita"
    | "tipoVisita"
> & {
    gastos: UpdateVisitExpense[];
};

export type EditVisitData = EditVisit & Pick<Visit, "id">;

export type VisitWhere = {
    gte_dataVisita?: string;
    lte_dataVisita?: string;
    salePersonId?: string;
    clienteId?: string;
    remoto?: string;
    carroEmpresa?: string;
    visitaPaga?: string;
    comentarios?: string;
    codigoNota?: string;
    tipoVisita?: string;
    gte_updatedAt?: string;
    lte_updatedAt?: string;
};
export type FindVisitsParams = FindParams<VisitWhere, keyof Visit>;

export type VisitReportWhere = {
    gte_dataVisita?: Date;
    lte_dataVisita?: Date;
    salePersonId?: string;
};
export type VisitExpenseInfoPerRoleWhere = VisitReportWhere;

export type GetVisitReportParams = FindParams<VisitReportWhere, {}>;
export type GetVisitExpensesInfoPerRole = FindParams<VisitExpenseInfoPerRoleWhere, {}>;

export type VisitDeleteOrUpdateParams = { currentSalePersonId?: string };

export type VisitExpenseInfoPerRole = {
    salePerson: UserRole;
    total: number;
    pago: number;
    visitasIdsAPagar: string[];
};
