import { TypeProductService } from "./type-product-service";
import { Manufacturer } from "./manufacturer";
import { CurrencyType } from "./commom";
import { Category } from "./category";
import { FindParams } from "./commom";

export type Product = {
    id: string;
    name: string;
    partNumber: string;
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
    empresaId: string;
    tipoProdutoServicoId: string;
    tipoProdutoServico: TypeProductService;
    fabricanteId: string;
    fabricante: Manufacturer;
    categoriaId: string;
    categoria: Category;
    custoUnit: number;
    tipoMoeda?: CurrencyType;
};

export type NewProduct = Pick<
    Product,
    "name" | "partNumber" | "custoUnit" | "tipoProdutoServicoId" | "fabricanteId" | "categoriaId" | "tipoMoeda"
>;

export type ProductWhere = {
    name?: string;
    partNumber?: string;
    gte_updatedAt?: string;
    lte_updatedAt?: string;
    tipoProdutoServicoId?: string;
    fabricanteId?: string;
    categoriaId?: string;
    custoUnit?: number;
    tipoMoeda?: string;
};

export type EditProductData = {
    id: string;
    name: string;
    partNumber: string;
    tipoProdutoServicoId: string;
    fabricanteId: string;
    categoriaId: string;
    custoUnit?: number;
    tipoMoeda?: CurrencyType; //TODO: depois de inserir em todos os produtos, retirar o opcional
};

export type FindProductsParams = FindParams<ProductWhere, keyof Product>;
