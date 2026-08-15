import { TypeProductService } from "./type-product-service";
import { CurrencyType, FindParams } from "./commom";

export type Service = {
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
    id: string;
    name: string;
    observacoes: string;
    tipoMoeda: CurrencyType;
    tipoProdutoServicoId: string;
    tipoProdutoServico: TypeProductService;
    valorCustoHora: number;
};

export type NewService = Pick<
    Service,
    "name" | "tipoMoeda" | "valorCustoHora" | "observacoes" | "tipoProdutoServicoId"
>;

export type EditServiceData = Pick<
    Service,
    "id" | "name" | "tipoMoeda" | "valorCustoHora" | "observacoes" | "tipoProdutoServicoId"
>;

export type ServiceWhere = {
    name?: string;
    tipoProdutoServicoId?: string;
    observacoes?: string;
    gte_updatedAt?: string;
    lte_updatedAt?: string;
    tipoMoeda?: string;
};
export type FindServicesParams = FindParams<ServiceWhere, keyof Service>;
