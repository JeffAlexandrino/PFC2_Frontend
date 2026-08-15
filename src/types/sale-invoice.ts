import { NewProductSale, ProductSale, UpdateProductSale } from "./sale-product";
import { NewServiceSale, ServiceSale, UpdateServiceSale } from "./sale-service";
import { InvoiceDate, RevenueType } from "./sale";
import { PaymentMethod } from "./payment-method";
import { Commission } from "./commission";

//SaleInvoice type is the base Sale-Invoice data structure that its used on the front
export type SaleInvoice = {
    id: string;
    formaParcelamento: number;
    codigo: string | null;
    dataFaturamento: Date;
    formaPagamentoId: string;
    datasBoleto: InvoiceDate[];
    createdAt: Date;
    updatedAt: Date;
    numOportunidadeCRM: string | null;
    numPedidoDistribuidor: string | null;
    impostoNota: number | null;
    dedutiveisDistribuidor: number | null;
    tipoFaturamento: RevenueType | null;
    markup: number | null;
    vendasProduto: ProductSale[];
    vendasServico: ServiceSale[];
    comissoes: Pick<
        Commission,
        | "distributorPaid"
        | "acelerador"
        | "porcentAcceleratorApproved"
        | "comissao"
        | "porcentCommissionApproved"
        | "comissaoPaga"
        | "dataComissao"
        | "id"
        | "valorMargemBrutaBase"
        | "vendaId"
        | "userRoleId"
    >[];
    formaPagamento: Pick<PaymentMethod, "createdAt" | "id" | "name" | "updatedAt">;

    valorCustoProdutos: number;
    valorMarkupProdutos: number;
    valorMarkupLiqProdutos: number;
    valorMargemBrutaProdutos: number;
    valorImpostoProdutos: number;
    valorVendaProdutos: number;

    valorCustoServicos: number;
    valorMarkupServicos: number;
    valorMarkupLiqServicos: number;
    valorMargemBrutaServicos: number;
    valorImpostoServicos: number;
    valorVendaServicos: number;

    valorCusto: number;
    valorMarkup: number;
    valorMarkupLiquido: number;
    valorMargemBruta: number;
    valorImpostoNota: number;
    valorDedutiveisDistribuidor: number;
    valorImpostos: number;
    valorVenda: number;
};

//NewSaleInvoice its the data structure needed to create a new sale entry on the server
//when sending a new saleInvoice, this type its used as structure for the data,
// and needs to be the same as in the back, so the database recognizes and create the new entry
export type NewSaleInvoice = Pick<
    SaleInvoice,
    | "codigo"
    | "dataFaturamento"
    | "formaPagamentoId"
    | "formaParcelamento"
    | "numOportunidadeCRM"
    | "numPedidoDistribuidor"
    | "impostoNota"
    | "dedutiveisDistribuidor"
    | "tipoFaturamento"
    | "markup"
> & {
    datasBoleto: Date[];
    vendasProduto: NewProductSale[];
    vendasServico: NewServiceSale[];
};

export type UpdateSaleInvoice = Pick<
    SaleInvoice,
    | "codigo"
    | "dataFaturamento"
    | "formaPagamentoId"
    | "formaParcelamento"
    | "numOportunidadeCRM"
    | "numPedidoDistribuidor"
    | "impostoNota"
    | "dedutiveisDistribuidor"
    | "tipoFaturamento"
    | "markup"
> & {
    datasBoleto: Date[];
    vendasProduto: UpdateProductSale[];
    vendasServico: UpdateServiceSale[];
};
