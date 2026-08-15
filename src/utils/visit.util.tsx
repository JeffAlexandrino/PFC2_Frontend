import { GTE_PREFIX, LTE_PREFIX } from "../hooks/use-onchange-filter";
import { EditVisitData, Visit, VisitWhere } from "../types/visits";

export default class VisitUtil {
    static DEFAULT_LIMIT_PER_PAGE = 25;

    static VISIT_DATE_KEY = "dataVisita";
    static GTE_VISIT_DATE_KEY = GTE_PREFIX + this.VISIT_DATE_KEY;
    static LTE_VISIT_DATE_KEY = LTE_PREFIX + this.VISIT_DATE_KEY;
    static SALE_PERSON_ROLE_ID_KEY = "vendedorRoleId";
    static CUSTOMER_ID_KEY = "clienteId";
    static REMOTE_KEY = "remoto";
    static ORGANIZATION_CAR_KEY = "carroEmpresa";
    static COMMENTS_KEY = "comentarios";
    static INVOICE_CODE_KEY = "codigoNota";
    static UPDATED_AT_KEY = "updatedAt";
    static GTE_UPDATED_AT_KEY = GTE_PREFIX + this.UPDATED_AT_KEY;
    static LTE_UPDATED_AT_KEY = LTE_PREFIX + this.UPDATED_AT_KEY;
    static PAID_STATUS_KEY = "visitaPaga";
    static TIPO_VISITA_KEY = "tipoVisita";

    public static getWhereParamsBy(searchParams: URLSearchParams): VisitWhere {
        return {
            gte_dataVisita: searchParams.get(this.GTE_VISIT_DATE_KEY) ?? undefined,
            lte_dataVisita: searchParams.get(this.LTE_VISIT_DATE_KEY) ?? undefined,
            salePersonId: searchParams.get(this.SALE_PERSON_ROLE_ID_KEY) ?? undefined,
            clienteId: searchParams.get(this.CUSTOMER_ID_KEY) ?? undefined,
            remoto: searchParams.get(this.REMOTE_KEY) ?? undefined,
            carroEmpresa: searchParams.get(this.ORGANIZATION_CAR_KEY) ?? undefined,
            comentarios: searchParams.get(this.COMMENTS_KEY) ?? undefined,
            codigoNota: searchParams.get(this.INVOICE_CODE_KEY) ?? undefined,
            gte_updatedAt: searchParams.get(this.GTE_UPDATED_AT_KEY) ?? undefined,
            lte_updatedAt: searchParams.get(this.LTE_UPDATED_AT_KEY) ?? undefined,
            visitaPaga: searchParams.get(this.PAID_STATUS_KEY) ?? undefined,
            tipoVisita: searchParams.get(this.TIPO_VISITA_KEY) ?? undefined,
        };
    }

    public static getFilterValuesBy(searchParams: URLSearchParams) {
        const gteVisitDate = searchParams.get(this.GTE_VISIT_DATE_KEY);
        const lteVisitDate = searchParams.get(this.LTE_VISIT_DATE_KEY);
        const gteUpdatedAt = searchParams.get(this.GTE_UPDATED_AT_KEY);
        const lteUpdatedAt = searchParams.get(this.LTE_UPDATED_AT_KEY);

        return {
            filterVisitDate: gteVisitDate && lteVisitDate ? { gte: gteVisitDate, lte: lteVisitDate } : undefined,
            filterUpdatedAt: gteUpdatedAt && lteUpdatedAt ? { gte: gteUpdatedAt, lte: lteUpdatedAt } : undefined,
            filterSalePersonId: searchParams.get(this.SALE_PERSON_ROLE_ID_KEY) ?? undefined,
            filterCustomerId: searchParams.get(this.CUSTOMER_ID_KEY) ?? undefined,
            filterRemote: searchParams.get(this.REMOTE_KEY) ?? undefined,
            filterOrganizationCar: searchParams.get(this.ORGANIZATION_CAR_KEY) ?? undefined,
            filterComments: searchParams.get(this.COMMENTS_KEY) ?? undefined,
            filterInvoiceCode: searchParams.get(this.INVOICE_CODE_KEY) ?? undefined,
            filterPaidStatus: searchParams.get(this.PAID_STATUS_KEY) ?? undefined,
            filterTipoVisita: searchParams.get(this.TIPO_VISITA_KEY) ?? undefined,
        };
    }

    public static getOnlyEditData(visit: Visit): EditVisitData {
        return {
            id: visit.id,
            clienteId: visit.clienteId,
            dataVisita: visit.dataVisita,
            salePersonId: visit.salePersonId,
            remoto: visit.remoto,
            comentarios: visit.comentarios,
            carroEmpresa: visit.carroEmpresa,
            kmInicial: visit.kmInicial,
            kmFinal: visit.kmFinal,
            visitaPaga: visit.visitaPaga,
            tipoVisita: visit.tipoVisita,
            gastos: visit.gastos.map((gasto) => ({
                nota: gasto.nota,
                tipoGasto: gasto.tipoGasto,
                valor: gasto.valor,
                carroEmpresa: gasto.carroEmpresa,
                kmInicial: gasto.kmInicial,
                kmFinal: gasto.kmFinal,
                tipoViagem: gasto.tipoViagem,
                dataViagem: gasto.dataViagem,
            })),
        };
    }
}
