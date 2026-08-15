import { EditSupplierData, Supplier, SupplierWhere } from "../types/supplier";
import { GTE_PREFIX, LTE_PREFIX } from "../hooks/use-onchange-filter";

export default class SupplierUtil {
    static DEFAULT_LIMIT_PER_PAGE = 25;

    static NAME_KEY = "name";
    static CNPJ_KEY = "cnpj";
    static EMAIL_KEY = "email";
    static UPDATED_AT_KEY = "updatedAt";
    static GTE_UPDATED_AT_KEY = GTE_PREFIX + this.UPDATED_AT_KEY;
    static LTE_UPDATED_AT_KEY = LTE_PREFIX + this.UPDATED_AT_KEY;

    public static getWhereParamsBy(searchParams: URLSearchParams): SupplierWhere {
        return {
            name: searchParams.get(this.NAME_KEY) ?? undefined,
            cnpj: searchParams.get(this.CNPJ_KEY) ?? undefined,
            email: searchParams.get(this.EMAIL_KEY) ?? undefined,
            gte_updatedAt: searchParams.get(this.GTE_UPDATED_AT_KEY) ?? undefined,
            lte_updatedAt: searchParams.get(this.LTE_UPDATED_AT_KEY) ?? undefined,
        };
    }

    public static getFilterValuesBy(searchParams: URLSearchParams) {
        const gteUpdatedAt = searchParams.get(this.GTE_UPDATED_AT_KEY);
        const lteUpdatedAt = searchParams.get(this.LTE_UPDATED_AT_KEY);

        return {
            name: searchParams.get(this.NAME_KEY) ?? undefined,
            cnpj: searchParams.get(this.CNPJ_KEY) ?? undefined,
            email: searchParams.get(this.EMAIL_KEY) ?? undefined,
            updatedAt: gteUpdatedAt && lteUpdatedAt ? { gte: gteUpdatedAt, lte: lteUpdatedAt } : undefined,
        };
    }

    public getOnlyEditData(supplier: Supplier): EditSupplierData {
        return {
            id: supplier.id,
            name: supplier.name,
            cnpj: supplier.cnpj,
            email: supplier.email,
        };
    }
}
