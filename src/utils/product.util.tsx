import { EditProductData, Product, ProductWhere } from "../types/product";
import { GTE_PREFIX, LTE_PREFIX } from "../hooks/use-onchange-filter";

export default class ProductUtil {
    static DEFAULT_LIMIT_PER_PAGE = 25;

    static NAME_KEY = "name";
    static PART_NUMBER_KEY = "partNumber";
    static CATEGORY_ID_KEY = "categoriaId";
    static MANUFACTURER_ID_KEY = "fabricanteId";
    static TYPE_PROD_SERV_ID_KEY = "tipoProdutoServicoId";
    static UPDATED_AT_KEY = "updatedAt";
    static CURRENCY_TYPE_KEY = "tipoMoeda";
    static GTE_UPDATED_AT_KEY = GTE_PREFIX + this.UPDATED_AT_KEY;
    static LTE_UPDATED_AT_KEY = LTE_PREFIX + this.UPDATED_AT_KEY;

    public static getWhereParamsBy(searchParams: URLSearchParams): ProductWhere {
        return {
            name: searchParams.get(this.NAME_KEY) ?? undefined,
            partNumber: searchParams.get(this.PART_NUMBER_KEY) ?? undefined,
            categoriaId: searchParams.get(this.CATEGORY_ID_KEY) ?? undefined,
            fabricanteId: searchParams.get(this.MANUFACTURER_ID_KEY) ?? undefined,
            tipoProdutoServicoId: searchParams.get(this.TYPE_PROD_SERV_ID_KEY) ?? undefined,
            tipoMoeda: searchParams.get(this.CURRENCY_TYPE_KEY) ?? undefined,
            gte_updatedAt: searchParams.get(this.GTE_UPDATED_AT_KEY) ?? undefined,
            lte_updatedAt: searchParams.get(this.LTE_UPDATED_AT_KEY) ?? undefined,
        };
    }

    public static getFilterValuesBy(searchParams: URLSearchParams) {
        const gteUpdatedAt = searchParams.get(this.GTE_UPDATED_AT_KEY);
        const lteUpdatedAt = searchParams.get(this.LTE_UPDATED_AT_KEY);
        return {
            name: searchParams.get(this.NAME_KEY) ?? undefined,
            partNumber: searchParams.get(this.PART_NUMBER_KEY) ?? undefined,
            categoryId: searchParams.get(this.CATEGORY_ID_KEY) ?? undefined,
            manufacturerId: searchParams.get(this.MANUFACTURER_ID_KEY) ?? undefined,
            typeProdServId: searchParams.get(this.TYPE_PROD_SERV_ID_KEY) ?? undefined,
            tipoMoeda: searchParams.get(this.CURRENCY_TYPE_KEY) ?? undefined,
            updatedAt: gteUpdatedAt && lteUpdatedAt ? { gte: gteUpdatedAt, lte: lteUpdatedAt } : undefined,
        };
    }

    public static getOnlyEditData(product: Product): EditProductData {
        return {
            id: product.id,
            name: product.name,
            partNumber: product.partNumber,
            tipoProdutoServicoId: product.tipoProdutoServicoId,
            fabricanteId: product.fabricanteId,
            categoriaId: product.categoriaId,
            tipoMoeda: product.tipoMoeda,
        };
    }
}
