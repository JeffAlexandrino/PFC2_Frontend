import { Commission, CommissionWhere, PayOneCommissioProps } from "../types/commission";
import { GTE_PREFIX, LTE_PREFIX } from "../hooks/use-onchange-filter";

export default class CommissionUtil {
    static DEFAULT_LIMIT_PER_PAGE = 25;
    //filter params constants
    static COMMISSION_DATE_KEY = "dataComissao";
    static GTE_COMMISSION_DATE_KEY = GTE_PREFIX + this.COMMISSION_DATE_KEY;
    static LTE_COMMISSION_DATE_KEY = LTE_PREFIX + this.COMMISSION_DATE_KEY;
    static CUSTOMER_ID_KEY = "clienteId";
    static INVOICE_CODE_KEY = "codigoNota";
    static INVOICE_TYPE_KEY = "tipoNota";
    static USER_ID_KEY = "userId";
    static PAID_STATUS_KEY = "comissaoPaga";
    static DISTRIBUTOR_PAID_KEY = "distributorPaid";
    static SALE_STATUS_KEY = "estadoVenda";
    static UPDATED_AT_KEY = "updatedAt";
    static NUM_CRM_KEY = "numOportunidadeCRM";
    static GTE_UPDATED_AT_KEY = GTE_PREFIX + this.UPDATED_AT_KEY;
    static LTE_UPDATED_AT_KEY = LTE_PREFIX + this.UPDATED_AT_KEY;

    //get the filter param of the column filtered, Ex: -> userId <- ?=6516516516
    public static getWhereParamsBy(searchParams: URLSearchParams): CommissionWhere {
        return {
            gte_dataComissao: searchParams.get(this.GTE_COMMISSION_DATE_KEY) ?? undefined,
            lte_dataComissao: searchParams.get(this.LTE_COMMISSION_DATE_KEY) ?? undefined,
            clienteId: searchParams.get(this.CUSTOMER_ID_KEY) ?? undefined,
            codigoNota: searchParams.get(this.INVOICE_CODE_KEY) ?? undefined,
            userId: searchParams.get(this.USER_ID_KEY) ?? undefined,
            numOportunidadeCRM: searchParams.get(this.NUM_CRM_KEY) ?? undefined,
            distributorPaid: searchParams.get(this.DISTRIBUTOR_PAID_KEY) ?? undefined,
            comissaoPaga: searchParams.get(this.PAID_STATUS_KEY) ?? undefined,
            estadoVenda: searchParams.get(this.SALE_STATUS_KEY) ?? undefined,
            gte_updatedAt: searchParams.get(this.GTE_UPDATED_AT_KEY) ?? undefined,
            lte_updatedAt: searchParams.get(this.LTE_UPDATED_AT_KEY) ?? undefined,
        };
    }

    //get the filter values of the column filtered, Ex: userId?= -> 6516516516 <-
    public static getFilterValuesBy(searchParams: URLSearchParams) {
        const gteCommissionDate = searchParams.get(this.GTE_COMMISSION_DATE_KEY);
        const lteCommissionDate = searchParams.get(this.LTE_COMMISSION_DATE_KEY);
        const gteUpdatedAt = searchParams.get(this.GTE_UPDATED_AT_KEY);
        const lteUpdatedAt = searchParams.get(this.LTE_UPDATED_AT_KEY);

        return {
            commissionDate:
                gteCommissionDate && lteCommissionDate ? { gte: gteCommissionDate, lte: lteCommissionDate } : undefined,
            updatedAt: gteUpdatedAt && lteUpdatedAt ? { gte: gteUpdatedAt, lte: lteUpdatedAt } : undefined,
            customerId: searchParams.get(this.CUSTOMER_ID_KEY) ?? undefined,
            invoiceCode: searchParams.get(this.INVOICE_CODE_KEY) ?? undefined,
            invoiceType: searchParams.get(this.INVOICE_TYPE_KEY) ?? undefined,
            filterNumCrm: searchParams.get(this.NUM_CRM_KEY) ?? undefined,
            userId: searchParams.get(this.USER_ID_KEY) ?? undefined,
            paidStatus: searchParams.get(this.PAID_STATUS_KEY) ?? undefined,
            distributorPaid: searchParams.get(this.DISTRIBUTOR_PAID_KEY) ?? undefined,
            saleStatus: searchParams.get(this.SALE_STATUS_KEY) ?? undefined,
        };
    }

    //Calculate the values of desired commission
    public static getCommissionValues(
        commission: Pick<
            Commission,
            | "comissao"
            | "acelerador"
            | "porcentAcceleratorApproved"
            | "porcentCommissionApproved"
            | "valorMargemBrutaBase"
        >
    ) {
        const approvedCommission =
            commission.porcentCommissionApproved === null
                ? 0
                : (commission.porcentCommissionApproved * commission.comissao) / 100;
        const approvedAccelerator =
            commission.porcentAcceleratorApproved === null
                ? 0
                : (commission.porcentAcceleratorApproved * commission.acelerador) / 100;

        const expectedCommissionValue = (commission.comissao * commission.valorMargemBrutaBase) / 100;
        const expectedAceleratorValue = (commission.acelerador * commission.valorMargemBrutaBase) / 100;
        const expectedValue = expectedCommissionValue + expectedAceleratorValue;

        const approvedCommissionValue = (approvedCommission * commission.valorMargemBrutaBase) / 100;
        const approvedAceleratorValue = (approvedAccelerator * commission.valorMargemBrutaBase) / 100;
        const approvedValue = approvedCommissionValue + approvedAceleratorValue;

        return { expectedValue, approvedValue, approvedAccelerator, approvedCommission };
    }

    //Gets the values of many commissions calculated by getCommissionValues()
    public static getCommissionsValues(
        commissions: Pick<
            Commission,
            | "comissao"
            | "acelerador"
            | "porcentAcceleratorApproved"
            | "porcentCommissionApproved"
            | "valorMargemBrutaBase"
        >[]
    ) {
        return commissions.reduce(
            (acc, commission) => {
                const { expectedValue, approvedValue } = this.getCommissionValues(commission);
                return {
                    expectedValue: acc.expectedValue + expectedValue,
                    approvedValue: acc.approvedValue + approvedValue,
                };
            },
            { expectedValue: 0, approvedValue: 0 } as { expectedValue: number; approvedValue: number }
        );
    }

    //Only take and show this commission Data in the EditCommissionForm
    public getOnlyEditData(commission: Commission): PayOneCommissioProps {
        return {
            id: commission.id,
            comissaoPaga: commission.comissaoPaga,
        };
    }
}
