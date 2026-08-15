//DADOS RETORNADOS PELA API
//Estas informações seguem a estrutura retornadas pela API.
//A desatualização destas estruturas pode ocasionar em erros.
import { RevenueType, SaleStatus } from "./types/sale";
import { CurrencyType } from "./types/commom";
import { UserRole } from "./types/user-role";

//USER
export type tUser = {
    id: string;
    name: string;
    email: string;
    role: tPapelUsuario;
    isEmailVerified: boolean;
    bloqueado: boolean;
    ativo: boolean;
    userRoles: UserRole[];
    vendedorUser?: PartialEntity<tVendedor, "ativo" | "createdAt" | "id" | "updatedAt" | "userId">;
    createdAt: Date;
    updatedAt: Date;
};

//VENDEDOR
export type tVendedor = {
    id: string;
    ativo: boolean;
    userId: string;
    user: PartialEntity<tUser, "ativo" | "bloqueado" | "email" | "id" | "name" | "createdAt" | "updatedAt">;
    createdAt: Date;
    updatedAt: Date;
    empresaId: string;
};

//CLIENTE
export type tCliente = {
    id: string;
    name: string;
    cnpj: string;
    email: string;
    telefone: string;
    segmentoId: string;
    segmento: PartialEntity<tSegmento, "id" | "name" | "createdAt" | "updatedAt">;
    createdAt: Date;
    updatedAt: Date;
    empresaId: string;
    qntVendas: number;
};

//PRODUTO
export type tProduto = {
    id: string;
    name: string;
    partNumber: string;
    ativo: boolean;
    tipoProdutoServicoId: string;
    tipoProdutoServico: tTipoProdutoServico;
    categoriaId: string;
    categoria: tCategoria;
    fabricanteId: string;
    fabricante: tFabricante;
    createdAt: Date;
    updatedAt: Date;
    empresaId: string;
    tipoMoeda?: CurrencyType;
    custoUnit: number;
};

//SERVICO
export type tServico = {
    id: string;
    name: string;
    valorCustoHora: number;
    observacoes: string;
    tipoMoeda: CurrencyType;
    ativo: boolean;
    tipoProdutoServicoId: string;
    tipoProdutoServico: tTipoProdutoServico;
    createdAt: Date;
    updatedAt: Date;
    empresaId: string;
};

//TIPO_PRODUTO_SERVICO
export type tTipoProdutoServico = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    empresaId: string;
};

//CONTRATO
export type tContrato = {
    id: string;
    name: string;
    comissaoPrimeiraParcela: boolean;
    createdAt: Date;
    updatedAt: Date;
    empresaId: string;
};

//CATEGORIA
export type tCategoria = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    empresaId: string;
};

//SEGMENTO
export type tSegmento = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    clientes: tCliente[];
    empresaId: string;
};

//FABRICANTE
export type tFabricante = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    empresaId: string;
};

//FORNECEDOR
export type tFornecedor = {
    id: string;
    name: string;
    cnpj: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    empresaId: string;
};

//VENDA_PRODUTO
export type tVendaProduto = {
    vendaId: string;
    venda: tVenda;
    produtoId: string;
    produto: tProduto;
    quantidade: number;
    valorCustoUnit: number;
    cotacao: number;
    tipoMoeda: CurrencyType;
    markup: number | null;
    dedutiveisDistribuidor: number | null;
    impostoNota: number | null;
    tipoFaturamento: RevenueType | null;
    fornecedores: tFornecedor[];
};

//VENDA_SERVICO
export type tVendaServico = {
    vendaId: number;
    servicoId: string;
    qntdHorasComercial: number;
    qntdHorasNaoComercial: number;
    qntdHorasEspecial: number;
    valorCustoHora: number;
    cotacao: number;
    tipoMoeda: CurrencyType;
    servico: tServico;
    venda: tVenda;
    markup: number | null;
    dedutiveisDistribuidor: number | null;
    impostoNota: number | null;
    tipoFaturamento: RevenueType | null;
};

//VENDA
export type tVenda = {
    id: string;
    formaParcelamento: number;
    codigoNota: string | null;
    estadoVenda: SaleStatus;
    dataVenda: Date;
    dataFaturamento: Date;
    clienteId: string;
    contratoId: string | null;
    formaPagamentoId: string;
    numOportunidadeCRM: string;
    numPedidoDistribuidor: string | null;
    datasBoleto: { id: string; data: Date; vendaId: string }[];
    vendaRenovacao: boolean;
    createdAt: Date;
    updatedAt: Date;
    empresaId: string;

    // markup: number | null;
    // dedutiveisDistribuidor: number | null;
    // impostoNota: number | null;
    // tipoFaturamento: RevenueType | null;
    vendasProduto: tVendaProdutoComCalculos[];
    vendasServico: tVendaServicoComCalculos[];
    comissoes: tComissao[];
    cliente: PartialEntity<
        tCliente,
        "cnpj" | "createdAt" | "email" | "id" | "name" | "segmentoId" | "telefone" | "updatedAt"
    >;
    vendedores: tVendedor[];
    formaPagamento: tFormaPagamento;
    contrato?: tContrato;

    //Venda Produto
    valorCustoProdutos: number;
    valorMarkupProdutos: number;
    valorMarkupLiqProdutos: number;
    valorMargemBrutaProdutos: number;
    valorImpostoProdutos: number;
    valorVendaProdutos: number;

    //Venda Servico
    valorCustoServicos: number;
    valorMarkupServicos: number;
    valorMarkupLiqServicos: number;
    valorMargemBrutaServicos: number;
    valorImpostoServicos: number;
    valorVendaServicos: number;

    //Venda
    valorCusto: number;
    valorMarkup: number;
    valorMarkupLiquido: number;
    valorMargemBruta: number;
    valorDedutiveisDistribuidor?: number;
    valorImpostoNota: number;
    valorImpostos: number;
    valorVenda: number; //valorVendaBruta: number;
};

//AUDITORIA
export type tAuditoria = {
    id: string;
    dadoId: string;
    dado: object;
    acao: tAcao;
    tabela: tTabela;
    data: Date;
    userId: string;
    usuario: tUser;
};

//COMISSAO
export type tComissao = {
    id: string;
    comissao: number; //Porcentagem da comissao do vendedor
    acelerador: number; //Porcentagem do acelerador do vendedor
    dataComissao: Date;
    valorMargemBrutaBase: number; //Valor da margem faturada base para o calculo da comissao
    vendedorId: string;
    vendaId: string;
    vendedor: tVendedor;
    comissaoPaga: boolean;
    venda: PartialEntity<tVenda, "cliente" | "codigoNota">;
};

//FORMA PAGAMENTO
export type tFormaPagamento = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    vendas: tVenda[];
    empresaId: string;
};

//DISTRIBUICAO COMISSAO
export type tDistribuicaoComissao = {
    id: string;
    vendedoresComissao: tVendedorComissao[];
    createdAt: Date;
    updatedAt: Date;
    empresaId: string;
};

//VENDEDOR COMISSAO
export type tVendedorComissao = {
    id: string;
    vendedorId: string;
    vendedor: tVendedor;
    comissao: number;
    createdAt: Date;
    updatedAt: Date;
};

//ACAO
export type tAcao = "CREATE" | "UPDATE" | "DELETE";

//TIPO_META_ALTERNATIVA
export type tTipoMeta = "VISITA" | "VALOR_VENDA" | "FATURAMENTO" | "MARGEM" | "MARKUP_BRUTO" | "MARKUP_LIQUIDO";

//TABELA
export type tTabela =
    | "USUARIO"
    | "VENDEDOR"
    | "CLIENTE"
    | "PRODUTO"
    | "FORNECEDOR"
    | "META"
    | "SERVICO"
    | "VENDA"
    | "COMISSAO"
    | "VISITA";

//PAPEL_USUARIO
export type tPapelUsuario = "VENDEDOR" | "ADMIN" | "GERENTE_VENDAS";

//AUXILIARES
//Estas estruturas são modificações que ocorrem com as estruturas do banco de dado ao decorrer da API e do FRONT-END.

//VENDA_PRODUTO_COM_CALCULOS
export type tVendaProdutoComCalculos = {
    valorCusto: number;
    valorMarkup: number;
    valorVenda: number;
    valorImpostos: number;
    valorMarkupLiquido: number;
    valorImpostoNota: number;
    valorMargem: number;
} & tVendaProduto;

//VENDA_SERVICO_COM_CALCULOS
export type tVendaServicoComCalculos = {
    valorCusto: number;
    valorMarkup: number; //valorLucroBruto: number;
    valorMargem: number; //valorLucroLiquido: number;
    valorImpostoNota: number;
    valorImpostos: number;
    valorVenda: number; //valorVendaBruta: number;
} & tVendaServico;

//DASHBOARD VALORES TOTAIS
export type tDashValoresTotais = {
    valorTotalAtual: number;
    avgValorTotalAtual: number;
    valorTotalAnterior: number;
    avgValorTotalAnterior: number;
};

//DASHBOARD EVOLUCOES
export type tDashEvolucoes = {
    evolucaoAnoAtual: { mesAno: string; valor: number; valorTicketMedio: number }[];
    evolucaoAnoAnterior: { mesAno: string; valor: number; valorTicketMedio: number }[];
};

//RANKING CLIENTES POR VENDA
export type tDashRankClientePorVenda = {
    cliente: {
        id: string;
        name: string;
        segmento: {
            id: string;
            name: string;
        };
    };
    valorAcumulado: number;
    posicao: number;
    valorGasto: number;
    qntVendas: number;
}[];

//RANKING VENDEDOR POR FATURAMENTO
export type tDashRankVendedorPorFaturamento = {
    userRole: {
        id: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    };
    valorAcumulado: number;
    valorAcumuladoVendaRenovacao: number;
    valorAcumuladoVendaNova: number;
    posicao: number;
    qntVendas: number;
};

//RANKING CATEGORIA POR VENDA
export type tDashRankCategoriaPorVenda = {
    categoria: {
        id: string;
        name: string;
    };
    valorAcumulado: number;
    posicao: number;
}[];

//EVOLUCAO FATURAMENTO
export type tDashEvolucaoFaturamento = {
    evolucaoFaturamentoAnoAtual: {
        mesAno: string;
        valorFaturamento: number;
    }[];
    evolucaoFaturamentoAnoAnterior: {
        mesAno: string;
        valorFaturamento: number;
    }[];
};

//EVOLUCAO TICKET MEDIO
export type tDashEvolucaoTicketMedio = {
    evolucaoTicketMedioAnoAtual: {
        mesAno: string;
        ticketMedio: number;
    }[];
    evolucaoTicketMedioAnoAnt: {
        mesAno: string;
        ticketMedio: number;
    }[];
};

//TIPOS PRODUTO SERVICO POR VENDA
export type tDashVendaPorTiposProdServ = {
    tipoProdServ: {
        id: string;
        name: string;
    };
    valorAcumulado: number;
}[];

//META ATINGIDA
export type tDashMetaAtingida = {
    valorMetaAtual: number;
    valorMetaAtingidaAtual: number;
    valorMetaAnterior: number;
    valorMetaAtingidaAnterior: number;
};

//META EMPRESA ATINGIDA
export type tDashMetaEmpresaAtingida = {
    valorMetaAtual: number;
    valorMetaAtingidaAtual: number;
    valorMetaAnterior: number;
    valorMetaAtingidaAnterior: number;
};

//MARGEM CONTRIBUICAO
export type tDashtMargemContribuicao = {
    margemContribuicaoAtual: number;
    margemContribuicaoAnterior: number;
};

//PARTIAL ENTITIES
//Auxilia a criar entidades com propriedades de outras

export type PartialEntity<Entity, Keys extends keyof Entity> = {
    [Key in Keys]: Entity[Key];
};

export type tEntityOptional<Entity> = {
    [Key in keyof Entity]?: Entity[Key];
};

//CASL ACTIONS AND SUBJECTS
//Auxilia na verificação de habilidades. Manter de acordo com a interface da API.

export type tSubjects =
    | "User"
    | "Cliente"
    | "Fornecedor"
    | "Fabricante"
    | "Categoria"
    | "DistribuicaoComissao"
    | "Venda"
    | "Servico"
    | "Produto"
    | "Meta"
    | "MetaEmpresa"
    | "TipoProdutoServico"
    | "Auth"
    | "Segmento"
    | "Auditoria"
    | "Dashboard"
    | "Comissao"
    | "FormaPagamento"
    | "Visita"
    | "Contrato"
    | "Empresa"
    | "UserRole"
    | "all";
