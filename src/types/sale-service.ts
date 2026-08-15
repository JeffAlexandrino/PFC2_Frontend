import { CurrencyType } from "./commom";
import { RevenueType } from "./sale";
import { Service } from "./service";

export type ServiceSale = {
    valorCusto: number;
    valorMarkup: number;
    valorVenda: number;
    valorImpostos: number;
    valorMarkupLiquido: number;
    valorImpostoNota: number;
    valorMargem: number;
    vendaId: string;
    servicoId: string;
    servico: Pick<
        Service,
        | "ativo"
        | "createdAt"
        | "updatedAt"
        | "id"
        | "name"
        | "observacoes"
        | "tipoMoeda"
        | "tipoProdutoServicoId"
        | "valorCustoHora"
    >;
    qntdHorasComercial: number;
    qntdHorasNaoComercial: number;
    qntdHorasEspecial: number;
    valorCustoHora: number;
    cotacao: number;
    markup: number | null; //TODO: Apos deletar do banco, deletar aqui tambem
    impostoNota: number | null; //TODO: Apos deletar do banco, deletar aqui tambem
    dedutiveisDistribuidor: number | null; //TODO: Apos deletar do banco, deletar aqui tambem
    tipoFaturamento: RevenueType | null; //TODO: Apos deletar do banco, deletar aqui tambem
    tipoMoeda: CurrencyType | null;
};

export type NewServiceSale = Pick<
    ServiceSale,
    | "cotacao"
    | "tipoMoeda"
    | "dedutiveisDistribuidor"
    | "tipoFaturamento"
    | "impostoNota"
    | "markup"
    | "qntdHorasComercial"
    | "qntdHorasEspecial"
    | "qntdHorasNaoComercial"
    | "servicoId"
>;

export type UpdateServiceSale = Pick<
    ServiceSale,
    | "cotacao"
    | "tipoMoeda"
    | "dedutiveisDistribuidor"
    | "tipoFaturamento"
    | "impostoNota"
    | "markup"
    | "qntdHorasComercial"
    | "qntdHorasEspecial"
    | "qntdHorasNaoComercial"
    | "servicoId"
>;
