import { Customer, CustomerWhere, EditCustomerData } from "../types/customer";
import { GTE_PREFIX, LTE_PREFIX } from "../hooks/use-onchange-filter";

export default class CustomerUtil {
    static DEFAULT_LIMIT_PER_PAGE = 25;

    static NAME_KEY = "name";
    static ORIGIN_KEY = "origem";
    static CNPJ_KEY = "cnpj";
    static EMAIL_KEY = "email";
    static PHONE_KEY = "telefone";
    static SEGMENT_ID_KEY = "segmentoId";
    static RESPONSAVEL_ID_KEY = "responsavelId";
    static UPDATED_AT_KEY = "updatedAt";
    static SALE_EXIST_KEY = "comprou";
    static GTE_UPDATED_AT_KEY = GTE_PREFIX + this.UPDATED_AT_KEY;
    static LTE_UPDATED_AT_KEY = LTE_PREFIX + this.UPDATED_AT_KEY;

    public static getWhereParamsBy(searchParams: URLSearchParams): CustomerWhere {
        const origem = searchParams.get(this.ORIGIN_KEY);

        return {
            name: searchParams.get(this.NAME_KEY) ?? undefined,
            cnpj: searchParams.get(this.CNPJ_KEY) ?? undefined,
            email: searchParams.get(this.EMAIL_KEY) ?? undefined,
            telefone: searchParams.get(this.PHONE_KEY) ?? undefined,
            segmentoId: searchParams.get(this.SEGMENT_ID_KEY) ?? undefined,
            responsavelId: searchParams.get(this.RESPONSAVEL_ID_KEY) ?? undefined,
            gte_updatedAt: searchParams.get(this.GTE_UPDATED_AT_KEY) ?? undefined,
            lte_updatedAt: searchParams.get(this.LTE_UPDATED_AT_KEY) ?? undefined,
            origem: origem === null ? undefined : (origem as CustomerWhere["origem"]),
            comprou: searchParams.get(this.SALE_EXIST_KEY) ?? undefined,
        };
    }

    public static getFilterValuesBy(searchParams: URLSearchParams) {
        const gteUpdatedAt = searchParams.get(this.GTE_UPDATED_AT_KEY);
        const lteUpdatedAt = searchParams.get(this.LTE_UPDATED_AT_KEY);

        return {
            name: searchParams.get(this.NAME_KEY) ?? undefined,
            origem: searchParams.get(this.ORIGIN_KEY) ?? undefined,
            cnpj: searchParams.get(this.CNPJ_KEY) ?? undefined,
            email: searchParams.get(this.EMAIL_KEY) ?? undefined,
            phone: searchParams.get(this.PHONE_KEY) ?? undefined,
            segmentId: searchParams.get(this.SEGMENT_ID_KEY) ?? undefined,
            responsavelId: searchParams.get(this.RESPONSAVEL_ID_KEY) ?? undefined,
            updatedAt: gteUpdatedAt && lteUpdatedAt ? { gte: gteUpdatedAt, lte: lteUpdatedAt } : undefined,
            comprou: searchParams.get(this.SALE_EXIST_KEY) ?? undefined,
        };
    }

    public static getOnlyEditData(customer: Customer): EditCustomerData {
        return {
            id: customer.id,
            name: customer.name,
            origem: customer.origem,
            cnpj: customer.cnpj,
            email: customer.email,
            telefone: customer.telefone,
            segmentoId: customer.segmentoId,
        };
    }
}
