import { CurrencyType } from "./commom";
import { Supplier } from "./supplier";
import { RevenueType } from "./sale";
import { Product } from "./product";

export type ProductSale = {
    valorCusto: number;
    valorMarkup: number;
    valorVenda: number;
    valorImpostos: number;
    valorMarkupLiquido: number;
    valorImpostoNota: number;
    valorMargem: number;
    vendaId: number;
    produtoId: string;
    produto: Pick<Product, "ativo" | "categoria" | "name">;
    quantidade: number;
    valorCustoUnit: number;
    markup: number | null; //TODO: Apos deletar do banco, deletar aqui tambem
    impostoNota: number | null; //TODO: Apos deletar do banco, deletar aqui tambem
    dedutiveisDistribuidor: number | null; //TODO: Apos deletar do banco, deletar aqui tambem
    tipoFaturamento: RevenueType | null; //TODO: Apos deletar do banco, deletar aqui tambem
    tipoMoeda: CurrencyType | null;
    cotacao: number;
    fornecedores: Pick<Supplier, "cnpj" | "createdAt" | "email" | "id" | "name" | "updatedAt">[];
};

export type NewProductSale = Pick<
    ProductSale,
    | "cotacao"
    | "produtoId"
    | "quantidade"
    | "tipoMoeda"
    | "valorCustoUnit"
    | "markup"
    | "impostoNota"
    | "dedutiveisDistribuidor"
    | "tipoFaturamento"
> & { fornecedoresId: string[] };

export type UpdateProductSale = Pick<
    ProductSale,
    | "cotacao"
    | "produtoId"
    | "quantidade"
    | "tipoMoeda"
    | "valorCustoUnit"
    | "markup"
    | "impostoNota"
    | "dedutiveisDistribuidor"
    | "tipoFaturamento"
> & { fornecedoresId: string[] };
