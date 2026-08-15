import { SaleInvoice } from "./sale-invoice";
import { ProductSale } from "./sale-product";
import { ServiceSale } from "./sale-service";
import { Sale, SaleStatus } from "./sale";
import { UserRole } from "./user-role";
import { FindParams } from "./commom";
import { User } from "./user";

//Defines type of data structure commission table will have, this type tells what data the front will have to receive and send
export type Commission = {
    id: string;
    userRole: UserRole;
    userRoleId: string;
    notaVenda: Pick<
        SaleInvoice,
        | "codigo"
        | "id"
        | "createdAt"
        | "dataFaturamento"
        | "updatedAt"
        | "formaPagamentoId"
        | "formaParcelamento"
        | "numOportunidadeCRM"
    > & {
        comissoes: Pick<Commission, "id" | "dataComissao" | "userRoleId" | "comissaoPaga">[];
        vendasProduto: Pick<ProductSale, "fornecedores">[];
        vendasServico: Pick<ServiceSale, "servicoId">[];
    };
    distributorPaid: boolean;
    venda: Pick<
        Sale,
        | "cliente"
        | "id"
        | "estadoVenda"
        | "dataVenda"
        | "empresaId"
        | "clienteId"
        | "numOportunidadeCRM"
        | "numPedidoDistribuidor"
        | "vendaRenovacao"
        | "contratoId"
        | "createdAt"
        | "updatedAt"
    >;
    vendaId: string;
    comissao: number;
    dataComissao: Date;
    valorMargemBrutaBase: number;
    acelerador: number;
    porcentCommissionApproved: number;
    porcentAcceleratorApproved: number;
    comissaoPaga: boolean;
    createdAt?: Date; //TODO: Vai se tornar obrigatório
    updatedAt?: Date;
};

//Defines the type of data structure when user makes a search or filter on the table,
// this must be the same as backend to work properly or will give API error when searching by a column value that the backend doesnt have
export type CommissionWhere = {
    gte_dataComissao?: string;
    lte_dataComissao?: string;
    clienteId?: string;
    codigoNota?: string;
    saleInvoiceId?: string;
    numOportunidadeCRM?: string;
    distributorPaid?: string;
    userId?: string;
    comissaoPaga?: string;
    estadoVenda?: string;
    gte_updatedAt?: string;
    lte_updatedAt?: string;
};
export type FindCommissionsParams = FindParams<CommissionWhere, keyof Commission>;

export type CommissionInfoPerUserWhere = {
    userId?: string;
    gte_dataComissao?: Date;
    lte_dataComissao?: Date;
    estadoVenda?: SaleStatus;
    distributorPaid?: string;
};
export type GetCommissionInfoPerUserParams = FindParams<CommissionInfoPerUserWhere, {}>;

export type GetCommissionReportParams = FindParams<CommissionInfoPerUserWhere, {}>;

export type CommissionInfoPerUser = {
    expectedValue: number;
    approvedValue: number;
    pago: number;
    comissoesIdsAPagar: string[];
    user: User;
};

export type PayOneCommissioProps = Pick<Commission, "id" | "comissaoPaga">;
export type DataToggleCommissionDistributorPaid = { saleInvoiceId: string; commissionDate: Date };
export type EditMultipleCommissionsData = Pick<Commission, "id" | "comissaoPaga">[];
