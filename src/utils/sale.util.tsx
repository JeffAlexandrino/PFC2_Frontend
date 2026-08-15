import { EditSaleData, Sale, SaleStatus, SaleWhere } from "../types/sale";
import { GTE_PREFIX, LTE_PREFIX } from "../hooks/use-onchange-filter";

export default class SaleUtil {
    static DEFAULT_LIMIT_PER_PAGE = 25;
    //filter params constants
    static SALE_DATE_KEY = "dataVenda";
    static GTE_SALE_DATE_KEY = GTE_PREFIX + this.SALE_DATE_KEY;
    static LTE_SALE_DATE_KEY = LTE_PREFIX + this.SALE_DATE_KEY;
    static SALE_INVOICE_DATE_KEY = "dataFaturamento";
    static GTE_SALE_INVOICE_DATE_KEY = GTE_PREFIX + this.SALE_INVOICE_DATE_KEY;
    static LTE_SALE_INVOICE_DATE_KEY = LTE_PREFIX + this.SALE_INVOICE_DATE_KEY;
    static NUM_CRM_KEY = "numOportunidadeCRM";
    static NUM_DISTRIBUTOR_KEY = "numPedidoDistribuidor";
    static CUSTOMER_ID_KEY = "clienteId";
    static SALE_STATUS_KEY = "status";
    static PAYMENT_METHOD_ID_KEY = "formaPagamentoId";
    static INVOICE_CODE_KEY = "codigoNota";
    static INVOICE_TYPE_KEY = "tipoNota";
    static CONTRACT_ID_KEY = "contratoId";
    static RENEWAL_SALE_KEY = "vendaRenovacao";
    static SALE_PERSON_ID_KEY = "salePersonId";
    static SOLUTION_ARCHITECT_ROLE_ID_KEY = "solutionArchitectId";
    static COMERCIAL_MANAGER_ROLE_ID_KEY = "comercialManagerId";
    static COMERCIAL_ASSISTANT_ROLE_ID_KEY = "comercialAssistantId";
    static REFERRER_ROLE_ID_KEY = "referrerId";
    static UPDATED_AT_KEY = "updatedAt";
    static GTE_UPDATED_AT_KEY = GTE_PREFIX + this.UPDATED_AT_KEY;
    static LTE_UPDATED_AT_KEY = LTE_PREFIX + this.UPDATED_AT_KEY;

    //get the filter param of the column filtered, Ex: -> clienteId <- ?=6516516516
    public static getWhereParamsBy(searchParams: URLSearchParams): SaleWhere {
        return {
            gte_dataVenda: searchParams.get(this.GTE_SALE_DATE_KEY) ?? undefined,
            lte_dataVenda: searchParams.get(this.LTE_SALE_DATE_KEY) ?? undefined,
            gte_dataFaturamento: searchParams.get(this.GTE_SALE_INVOICE_DATE_KEY) ?? undefined,
            lte_dataFaturamento: searchParams.get(this.LTE_SALE_INVOICE_DATE_KEY) ?? undefined,
            numOportunidadeCRM: searchParams.get(this.NUM_CRM_KEY) ?? undefined,
            numPedidoDistribuidor: searchParams.get(this.NUM_DISTRIBUTOR_KEY) ?? undefined,
            clienteId: searchParams.get(this.CUSTOMER_ID_KEY) ?? undefined,
            estadoVenda: searchParams.get(this.SALE_STATUS_KEY) ?? undefined,
            formaPagamentoId: searchParams.get(this.PAYMENT_METHOD_ID_KEY) ?? undefined,
            codigoNota: searchParams.get(this.INVOICE_CODE_KEY) ?? undefined,
            contratoId: searchParams.get(this.CONTRACT_ID_KEY) ?? undefined,
            salePersonId: searchParams.get(this.SALE_PERSON_ID_KEY) ?? undefined,
            comercialAssistantId: searchParams.get(this.COMERCIAL_ASSISTANT_ROLE_ID_KEY) ?? undefined,
            solutionArchitectId: searchParams.get(this.SOLUTION_ARCHITECT_ROLE_ID_KEY) ?? undefined,
            comercialManagerId: searchParams.get(this.COMERCIAL_MANAGER_ROLE_ID_KEY) ?? undefined,
            referrerId: searchParams.get(this.REFERRER_ROLE_ID_KEY) ?? undefined,
            vendaRenovacao: searchParams.get(this.RENEWAL_SALE_KEY) ?? undefined,
            gte_updatedAt: searchParams.get(this.GTE_UPDATED_AT_KEY) ?? undefined,
            lte_updatedAt: searchParams.get(this.LTE_UPDATED_AT_KEY) ?? undefined,
        };
    }

    //get the filter values of the column filtered, Ex: clienteId?= -> 6516516516 <-
    public static getFilterValuesBy(searchParams: URLSearchParams) {
        const gteSaleDate = searchParams.get(this.GTE_SALE_DATE_KEY);
        const lteSaleDate = searchParams.get(this.LTE_SALE_DATE_KEY);
        const gteSaleInvDate = searchParams.get(this.GTE_SALE_INVOICE_DATE_KEY);
        const lteSaleInvDate = searchParams.get(this.LTE_SALE_INVOICE_DATE_KEY);
        const gteUpdatedAt = searchParams.get(this.GTE_UPDATED_AT_KEY);
        const lteUpdatedAt = searchParams.get(this.LTE_UPDATED_AT_KEY);

        return {
            filterSaleDate: gteSaleDate && lteSaleDate ? { gte: gteSaleDate, lte: lteSaleDate } : undefined,
            filterSaleInvoiceDate:
                gteSaleInvDate && lteSaleInvDate ? { gte: gteSaleInvDate, lte: lteSaleInvDate } : undefined,
            filterNumCrm: searchParams.get(this.NUM_CRM_KEY) ?? undefined,
            filterNumDistributor: searchParams.get(this.NUM_DISTRIBUTOR_KEY) ?? undefined,
            filterCustomerId: searchParams.get(this.CUSTOMER_ID_KEY) ?? undefined,
            filterSaleStatus: searchParams.get(this.SALE_STATUS_KEY) ?? undefined,
            filterPaymentMethodId: searchParams.get(this.PAYMENT_METHOD_ID_KEY) ?? undefined,
            filterInvoiceCode: searchParams.get(this.INVOICE_CODE_KEY) ?? undefined,
            filterInvoiceType: searchParams.get(this.INVOICE_TYPE_KEY) ?? undefined,
            filterContractId: searchParams.get(this.CONTRACT_ID_KEY) ?? undefined,
            filterSalePersonId: searchParams.get(this.SALE_PERSON_ID_KEY) ?? undefined,
            filterComercialAssistantId: searchParams.get(this.COMERCIAL_ASSISTANT_ROLE_ID_KEY) ?? undefined,
            filterSolutionArchitectId: searchParams.get(this.SOLUTION_ARCHITECT_ROLE_ID_KEY) ?? undefined,
            filterComercialManagerId: searchParams.get(this.COMERCIAL_MANAGER_ROLE_ID_KEY) ?? undefined,
            filterReferrerId: searchParams.get(this.REFERRER_ROLE_ID_KEY) ?? undefined,
            filterRenewalSale: searchParams.get(this.RENEWAL_SALE_KEY) ?? undefined,
            filterUpdatedAt: gteUpdatedAt && lteUpdatedAt ? { gte: gteUpdatedAt, lte: lteUpdatedAt } : undefined,
        };
    }

    public static getStatusDescriptionBy(status?: SaleStatus): string {
        switch (status) {
            case SaleStatus.INITIAL:
                return "Inicial";
            case SaleStatus.BILLING_AUDIT:
                return "Auditoria faturamento";
            case SaleStatus.FINANCIAL_AUDIT:
                return "Auditoria financeira";
            case SaleStatus.AVAILABLE_PAYMENT:
                return "Disponível para pagamento";
            case SaleStatus.PAID:
                return "Pago";
            default:
                return "";
        }
    }

    //Only take and show this sale Data in the EditSaleForm
    public static getOnlyEditData(sale: Sale): EditSaleData {
        return {
            id: sale.id,
            dataVenda: sale.dataVenda,
            accountManagerId: sale.accountManagerId,
            insideSalesId: sale.insideSalesId,
            referrerId: sale.referrerId,
            comercialManagerId: sale.comercialManagerId,
            comercialAssistantId: sale.comercialAssistantId,
            solutionArchitectId: sale.solutionArchitectId,
            clienteId: sale.clienteId,
            contratoId: sale.contratoId,
            estadoVenda: sale.estadoVenda,
            vendaRenovacao: sale.vendaRenovacao,
            numOportunidadeCRM: sale.numOportunidadeCRM,
            numPedidoDistribuidor: sale.numPedidoDistribuidor,
            notasVenda: sale.notasVenda.map((notaVenda) => ({
                formaPagamentoId: notaVenda.formaPagamentoId,
                formaParcelamento: notaVenda.formaParcelamento,
                dataFaturamento: notaVenda.dataFaturamento,
                codigo: notaVenda.codigo,
                numOportunidadeCRM: notaVenda.numOportunidadeCRM,
                numPedidoDistribuidor: notaVenda.numPedidoDistribuidor,
                impostoNota: notaVenda.impostoNota,
                dedutiveisDistribuidor: notaVenda.dedutiveisDistribuidor,
                tipoFaturamento: notaVenda.tipoFaturamento,
                markup: notaVenda.markup,
                vendasProduto: notaVenda.vendasProduto.map((vendaProduto) => ({
                    tipoMoeda: vendaProduto.tipoMoeda,
                    cotacao: vendaProduto.cotacao,
                    valorCustoUnit: vendaProduto.valorCustoUnit,
                    quantidade: vendaProduto.quantidade,
                    markup: vendaProduto.markup, //TODO: Depois de remover do banco, remover daqui
                    tipoFaturamento: vendaProduto.tipoFaturamento, //TODO: Depois de remover do banco, remover daqui
                    impostoNota: vendaProduto.impostoNota, //TODO: Depois de remover do banco, remover daqui
                    dedutiveisDistribuidor: vendaProduto.dedutiveisDistribuidor, //TODO: Depois de remover do banco, remover daqui
                    produtoId: vendaProduto.produtoId,
                    fornecedoresId: vendaProduto.fornecedores.map(({ id }) => id),
                })),
                vendasServico: notaVenda.vendasServico.map((vendaServico) => ({
                    cotacao: vendaServico.cotacao,
                    markup: vendaServico.markup, //TODO: Depois de remover do banco, remover daqui
                    tipoFaturamento: vendaServico.tipoFaturamento, //TODO: Depois de remover do banco, remover daqui
                    impostoNota: vendaServico.impostoNota, //TODO: Depois de remover do banco, remover daqui
                    dedutiveisDistribuidor: vendaServico.dedutiveisDistribuidor, //TODO: Depois de remover do banco, remover daqui
                    servicoId: vendaServico.servicoId,
                    qntdHorasComercial: vendaServico.qntdHorasComercial,
                    qntdHorasEspecial: vendaServico.qntdHorasEspecial,
                    qntdHorasNaoComercial: vendaServico.qntdHorasNaoComercial,
                    tipoMoeda: vendaServico.tipoMoeda,
                })),
                datasBoleto: notaVenda.datasBoleto.map((dataBoleto) => dataBoleto.data),
            })),
        };
    }
}
