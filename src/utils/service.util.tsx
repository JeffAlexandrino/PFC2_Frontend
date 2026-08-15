import { EditServiceData, Service, ServiceWhere } from "../types/service";
import { GTE_PREFIX, LTE_PREFIX } from "../hooks/use-onchange-filter";

export default class ServiceUtil {
    static DEFAULT_LIMIT_PER_PAGE = 25;

    static NAME_KEY = "name";
    static TYPE_PROD_SERV_ID_KEY = "tipoProdutoServicoId";
    static OBSERVATIONS_KEY = "observacoes";
    static UPDATED_AT_KEY = "updatedAt";
    static CURRENCY_TYPE_KEY = "tipoMoeda";
    static GTE_UPDATED_AT_KEY = GTE_PREFIX + this.UPDATED_AT_KEY;
    static LTE_UPDATED_AT_KEY = LTE_PREFIX + this.UPDATED_AT_KEY;

    public static getWhereToFindServicesFrom(searchParams: URLSearchParams): ServiceWhere {
        return {
            name: searchParams.get(this.NAME_KEY) ?? undefined,
            tipoProdutoServicoId: searchParams.get(this.TYPE_PROD_SERV_ID_KEY) ?? undefined,
            observacoes: searchParams.get("observacoes") ?? undefined,
            tipoMoeda: searchParams.get(this.CURRENCY_TYPE_KEY) ?? undefined,
            gte_updatedAt: searchParams.get("gte_updatedAt") ?? undefined,
            lte_updatedAt: searchParams.get("lte_updatedAt") ?? undefined,
        };
    }

    public static getFilterValuesBy(searchParams: URLSearchParams) {
        const gteUpdatedAt = searchParams.get(this.GTE_UPDATED_AT_KEY);
        const lteUpdatedAt = searchParams.get(this.LTE_UPDATED_AT_KEY);

        return {
            name: searchParams.get(this.NAME_KEY) ?? undefined,
            typeProdServId: searchParams.get(this.TYPE_PROD_SERV_ID_KEY) ?? undefined,
            observations: searchParams.get(this.OBSERVATIONS_KEY) ?? undefined,
            tipoMoeda: searchParams.get(this.CURRENCY_TYPE_KEY) ?? undefined,
            updatedAt: gteUpdatedAt && lteUpdatedAt ? { gte: gteUpdatedAt, lte: lteUpdatedAt } : undefined,
        };
    }

    public getOnlyEditData(service: Service): EditServiceData {
        return {
            id: service.id,
            name: service.name,
            observacoes: service.observacoes,
            tipoMoeda: service.tipoMoeda,
            tipoProdutoServicoId: service.tipoProdutoServicoId,
            valorCustoHora: service.valorCustoHora,
        };
    }
}
