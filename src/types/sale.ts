import { NewSaleInvoice, SaleInvoice, UpdateSaleInvoice } from "./sale-invoice";
import { UserRole } from "./user-role";
import { Contract } from "./contract";
import { Customer } from "./customer";
import { FindParams } from "./commom";

//enum types to use as constants around all the system, helps maintenance
export enum RevenueType {
    DIRETO = "DIRETO",
    REVENDA = "REVENDA",
}

export enum SaleStatus {
    INITIAL = "INITIAL",
    BILLING_AUDIT = "BILLING_AUDIT",
    FINANCIAL_AUDIT = "FINANCIAL_AUDIT",
    AVAILABLE_PAYMENT = "AVAILABLE_PAYMENT",
    PAID = "PAID",
}

export enum InvoiceType {
    PRODUCT = "Produto",
    SERVICE = "Serviço",
    PRODUCT_AND_SERVICE = "Produto e Serviço",
    NONE = "Nenhum",
}

export type InvoiceDate = {
    id: string;
    data: Date;
    vendaId: string;
};

export type Sale = {
    id: string;
    estadoVenda: SaleStatus;
    dataVenda: Date;
    clienteId: string;
    accountManagerId: string | null;
    insideSalesId: string | null;
    referrerId: string | null;
    comercialManagerId: string | null;
    comercialAssistantId: string | null;
    solutionArchitectId: string | null;
    accountManager: UserRole | null;
    insideSales: UserRole | null;
    referrer: UserRole | null;
    comercialManager: UserRole | null;
    solutionArchitect: UserRole | null;
    comercialAssistant: UserRole | null;
    numOportunidadeCRM?: string | null; //TODO: Mover os dados para codigo em SaleInvoce e deletar aqui
    numPedidoDistribuidor?: string | null; //TODO: Mover para SaleInvoce e deletar aqui
    vendaRenovacao: boolean;
    contratoId?: string | null;
    createdAt: Date;
    updatedAt: Date;
    empresaId: string;
    notasVenda: SaleInvoice[];
    cliente: Pick<Customer, "cnpj" | "createdAt" | "email" | "id" | "name" | "segmentoId" | "telefone" | "updatedAt">;
    contrato: null | Pick<Contract, "createdAt" | "id" | "name" | "updatedAt">;

    valorCusto: number;
    valorMarkup: number;
    valorMarkupLiquido: number;
    valorMargemBruta: number;
    valorImpostoNota: number;
    valorDedutiveisDistribuidor: number;
    valorImpostos: number;
    valorVenda: number;
};

export type NewSale = Pick<
    Sale,
    | "accountManagerId"
    | "insideSalesId"
    | "referrerId"
    | "comercialManagerId"
    | "comercialAssistantId"
    | "solutionArchitectId"
    | "clienteId"
    | "contratoId"
    | "dataVenda"
    | "estadoVenda"
    | "vendaRenovacao"
> & {
    notasVenda: NewSaleInvoice[];
};

export type UpdateSale = Pick<
    Sale,
    | "accountManagerId"
    | "insideSalesId"
    | "referrerId"
    | "comercialManagerId"
    | "comercialAssistantId"
    | "solutionArchitectId"
    | "clienteId"
    | "contratoId"
    | "dataVenda"
    | "estadoVenda"
    | "numOportunidadeCRM" //TODO: Deletar aqui após remover do banco
    | "numPedidoDistribuidor" //TODO: Deletar aqui após remover do banco
    | "vendaRenovacao"
> & {
    notasVenda: UpdateSaleInvoice[];
};

export type SaleWhere = {
    gte_dataVenda?: string;
    lte_dataVenda?: string;
    gte_dataFaturamento?: string;
    lte_dataFaturamento?: string;
    numOportunidadeCRM?: string;
    numPedidoDistribuidor?: string;
    clienteId?: string;
    estadoVenda?: string;
    formaPagamentoId?: string;
    codigoNota?: string;
    contratoId?: string;
    salePersonId?: string;
    referrerId?: string;
    solutionArchitectId?: string;
    comercialManagerId?: string;
    comercialAssistantId?: string;
    vendaRenovacao?: string;
    gte_updatedAt?: string;
    lte_updatedAt?: string;
};
export type SaleSortBy = keyof Sale;
export type FindSalesParams = FindParams<SaleWhere, SaleSortBy>;

export type GetSalesReportParams = FindParams<SaleWhere, {}>;

export type SaleUpdateParams = {
    accountManagerIdAtual?: string;
    insideSalesIdAtual?: string;
    estadoVendaAtual?: SaleStatus;
};
export type SaleDeleteParams = {
    accountManagerIdAtual?: string;
    insideSalesIdAtual?: string;
    estadoVendaAtual?: SaleStatus;
};

export type EditSaleData = UpdateSale & Pick<Sale, "id">;
