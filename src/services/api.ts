import axios, { AxiosError, AxiosResponse } from "axios";
import {
    tEntityOptional,
    tCategoria,
    tCliente,
    tFabricante,
    tFornecedor,
    tProduto,
    tSegmento,
    tServico,
    tTipoProdutoServico,
    tUser,
    tVendedor,
    PartialEntity,
    tDashMetaAtingida,
    tDashRankClientePorVenda,
    tDashRankVendedorPorFaturamento,
    tDashRankCategoriaPorVenda,
    //tDashEvolucaoFaturamento,
    tDashVendaPorTiposProdServ,
    //tDashEvolucaoTicketMedio,
    tAuditoria,
    tFormaPagamento,
    tContrato,
    tDashValoresTotais,
    tDashEvolucoes,
    tDashtMargemContribuicao,
} from "../interfaces";
import { tNovoProduto } from "../components/forms/FormProduto";
import { tNovoServico } from "../components/forms/FormServico";
import { tNovaCategoria } from "../components/forms/FormCategoria";
import { tNovoFabricante } from "../components/forms/FormFabricante";
import { tNovoSegmento } from "../components/forms/FormSegmento";
import { tNovoTipoProdutoServico } from "../components/forms/FormTipoProdutoServico";
import { tNovaFormaPagamento } from "../components/forms/FormFormaPagamento";
import { tNovoContrato } from "../components/forms/FormContrato";
import {
    //EditUserByUserRoleData,
    //EditUserRoleData,
    //NewUserRole,
    UserRole,
    FindUserRoleParams,
} from "../types/user-role";
import { DashboardWhere } from "../types/dashboard";
import {
    Commission,
    CommissionInfoPerUser,
    GetCommissionInfoPerUserParams,
    FindCommissionsParams,
    GetCommissionReportParams,
    PayOneCommissioProps,
    DataToggleCommissionDistributorPaid,
} from "../types/commission";
import {
    CommissionDistribution,
    CommissionDistributionQueryProps,
    EditCommissionDistributionData,
    NewCommissionDistribution,
} from "../types/commission-distribution";
import { Customer, CustomerQueryProps, EditCustomerData, NewCustomer, NewImportCustomer } from "../types/customer";
//import { Role } from "../types/commom";
import { EditSupplierData, NewSupplier, Supplier, FindSuppliersParams } from "../types/supplier";
import {
    EditVisitData,
    NewVisit,
    Visit,
    VisitDeleteOrUpdateParams,
    VisitExpenseInfoPerRole,
    GetVisitExpensesInfoPerRole,
    FindVisitsParams,
    GetVisitReportParams,
} from "../types/visits";
import { EditOrganizationData, Organization, OrganizationQueryProps } from "../types/organization";
import { DataUpdateTarget, NewTarget, Target, TargetQueryProps } from "../types/target";
import {
    DataUpdateUserInfo,
    DataUpdateUserRole,
    FindUserParams,
    GetUserReportParams,
    NewUser,
    ParamsUpdateOrDeleteUser,
    User,
    UserSession,
} from "../types/user";
import { FindServicesParams } from "../types/service";
import { FindProductsParams } from "../types/product";
import {
    EditSaleData,
    FindSalesParams,
    GetSalesReportParams,
    NewSale,
    Sale,
    SaleDeleteParams,
    SaleUpdateParams,
} from "../types/sale";
import ApiRoutes from "../lib/api-routes";
import FrontRoutes from "../lib/front-routes";
import {
    DataUpdateOrganizationTarget,
    NewOrganizationTarget,
    OrganizationTarget,
    OrganizationTargetQueryProps,
} from "../types/organization-targets";

//TYPES
export type tTokenResponse = {
    tokens?: {
        access: {
            token: string;
            expires: Date;
        };
        refresh: {
            token: string;
            expires: Date;
        };
    };
};
export type tCredenciais = { email: string; password: string };
export type tQueryParams<WhereEntity, SortEntity> = {
    sortBy?: keyof SortEntity;
    sortType?: "asc" | "desc";
    limit?: number;
    page?: number;
    where?: tEntityOptional<WhereEntity>;
};

//TYPES PARAMS
export type tQueryParamsVendedor = tQueryParams<
    PartialEntity<tVendedor, "id"> & { campoPesquisa?: string },
    PartialEntity<tVendedor, "createdAt">
>;
export type tQueryParamsFornecedor = tQueryParams<
    PartialEntity<tFornecedor, "name"> & { campoPesquisa?: string },
    PartialEntity<tFornecedor, "name" | "createdAt">
>;
export type tQueryParamsCliente = tQueryParams<
    PartialEntity<tCliente, "name" | "segmentoId"> & { campoPesquisa?: string },
    PartialEntity<tCliente, "name" | "createdAt">
>;
export type tQueryParamsProduto = tQueryParams<
    PartialEntity<tProduto, "name" | "tipoProdutoServicoId" | "categoriaId"> & { campoPesquisa?: string },
    PartialEntity<tProduto, "name" | "createdAt">
>;
export type tQueryParamsServico = tQueryParams<
    PartialEntity<tServico, "name" | "tipoProdutoServicoId"> & { campoPesquisa?: string },
    PartialEntity<tServico, "name" | "createdAt">
>;
export type tQueryParamsCategoria = tQueryParams<
    PartialEntity<tCategoria, "name">,
    PartialEntity<tCategoria, "name" | "createdAt">
>;
export type tQueryParamsContrato = tQueryParams<
    PartialEntity<tContrato, "name">,
    PartialEntity<tContrato, "name" | "createdAt">
>;
export type tQueryParamsSegmento = tQueryParams<
    PartialEntity<tSegmento, "name">,
    PartialEntity<tSegmento, "name" | "createdAt">
>;
export type tQueryParamsTipoProdServ = tQueryParams<
    PartialEntity<tTipoProdutoServico, "name">,
    PartialEntity<tTipoProdutoServico, "name" | "createdAt">
>;
export type tQueryParamsFabricante = tQueryParams<
    PartialEntity<tFabricante, "name">,
    PartialEntity<tFabricante, "name" | "createdAt">
>;
export type tQueryParamsUser = tQueryParams<PartialEntity<tUser, "role">, PartialEntity<tUser, "name">>;

export type tQueryParamsAuditoria = tQueryParams<
    PartialEntity<tAuditoria, "tabela" | "dadoId" | "acao">,
    PartialEntity<tAuditoria, "data">
>;
export type tQueryParamsFormaPagamento = tQueryParams<
    PartialEntity<tFormaPagamento, "name">,
    PartialEntity<tFormaPagamento, "name" | "createdAt">
>;

//LOCAL_STORAGE
//Salvando tokens no localstorage
const ACCESS_TOKEN_KEY = "_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "_REFRESH_TOKEN";

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const setAccessToken = (newAccessToken: string) => localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
const setRefreshToken = (newRefreshToken: string) => localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
const cleanRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN_KEY);

//INSTANCIA DO AXIOS PARA A API
// Base URL keeps only the root; version will be added per-request so it can change dynamically
const instancia = axios.create({
    baseURL: process.env.REACT_APP_URL_API,
    timeout: 20000,
});

//FUCOES AUXILIARES
//Estas funcoes e variaveis auxiliam o axios a realizar tarefas especificas para o contexto deste sistema.

//Verifica strings em formato de datas
const formatoDeData = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;
function ehUmaData(value: any): boolean {
    return value && typeof value === "string" && formatoDeData.test(value);
}

//Lida com as datas vindas em formato de string da API e as transforma em data para o resto da aplição.
function handleDatas(dados: any) {
    if (dados === null || dados === undefined || typeof dados !== "object") return dados;

    for (const key of Object.keys(dados)) {
        const valor = dados[key];
        if (ehUmaData(valor)) dados[key] = new Date(valor);
        else if (typeof valor === "object") handleDatas(valor);
    }
}

//Salva os token vindos da api no localstorage
function handleTokens(body: tTokenResponse) {
    if (body.tokens !== undefined) {
        setAccessToken(body.tokens.access.token);
        setRefreshToken(body.tokens.refresh.token);
    }
}

//INTERCEPTORES
//Isto intercepta tanto requisições realizadas à API quanto respostas da API para modificar ou lidar com alguns parametros.

//Adicionando interceptor de requisições.
instancia.interceptors.request.use(
    function (config) {
        // Adicionando token de acesso
        config.headers.Authorization = `Bearer ${getAccessToken()}`;
        // Append current version segment to URL if not already included
        if (config.url) {
            const versionPath = ApiRoutes.getRouteVersion();
            if (!config.url.startsWith(versionPath)) {
                // ensure leading slash on url portion
                const suffix = config.url.startsWith("/") ? config.url : "/" + config.url;
                config.url = versionPath + suffix;
            }
        }
        return config;
    },
    function (error) {
        //Não esquecer de rejeitar o error para o resto da aplicação.
        return Promise.reject(error);
    }
);

//Adicionando interceptor de respostas
instancia.interceptors.response.use(
    function (response) {
        // Convertendo string dates em object dates
        handleDatas(response.data);
        // Salvando tokens de acesso e de refresh
        handleTokens(response.data);
        return response;
    },
    function (error) {
        if (error?.response?.status === 401) {
            //Atualizar tokens de acesso se possivel ou redirecionar para login
            const fnRedirecionaParaLogin = () => {
                if (window.location.pathname !== FrontRoutes.getLogin())
                    window.location.href = window.location.origin + FrontRoutes.getLogin();
            };

            const refreshToken = getRefreshToken();
            if (!refreshToken) fnRedirecionaParaLogin();
            else
                api.atualizarTokenAcesso(refreshToken)
                    .then(() => window.location.reload()) //Não esquecer de atualizar o front-end.
                    .catch((err) => {
                        cleanRefreshToken();
                        fnRedirecionaParaLogin();
                        console.error(err);
                    });
        }
        //Não esquecer de rejeitar o erro para o resto da aplicação.
        return Promise.reject(error);
    }
);

//ROTAS
const api = {
    //AUTH
    login: (credentials: tCredenciais) => instancia.post(ApiRoutes.getLogin(), credentials),

    logout: () =>
        instancia.post(ApiRoutes.getLogout(), {
            accessToken: getAccessToken(),
            refreshToken: getRefreshToken(),
        }),

    updateCurrentRole: async (newUserRoleId: string, signal?: AbortSignal) =>
        instancia.patch(ApiRoutes.getSessionRole(), { data: { userRoleId: newUserRoleId } }, { signal }),

    mudarSenhaAtual: (password: string, signal?: AbortSignal) =>
        instancia.patch(ApiRoutes.getUpdatePassword(), { password }, { signal, params: { token: getAccessToken() } }),

    mudarSenhaPerdida: (body: { password: string; token: string }, signal?: AbortSignal) =>
        instancia.post(
            ApiRoutes.getResetPassword(),
            { password: body.password },
            { signal, params: { token: body.token } }
        ),

    recuperarSenha: (body: { email: string; redirect: string }, signal?: AbortSignal) =>
        instancia.post(ApiRoutes.getResetPasswordToken(), body, {
            signal,
            params: { token: getAccessToken() },
        }),

    atualizarTokenAcesso: (refreshToken: string, signal?: AbortSignal) =>
        instancia.post(ApiRoutes.getSessionKeepAlive(), { refreshToken }, { signal }),

    //USUARIOS
    getInfoUsuario: (signal?: AbortSignal): Promise<AxiosResponse<UserSession, AxiosError>> =>
        instancia.get(ApiRoutes.getMyUserInfo(), { signal }),

    findManyUsers: async (params?: FindUserParams, signal?: AbortSignal): Promise<AxiosResponse<User[], AxiosError>> =>
        instancia.get(ApiRoutes.getUser(), { params, signal }),

    editRoleUser: async (
        { userId, ...data }: DataUpdateUserRole,
        signal: AbortSignal,
        params: ParamsUpdateOrDeleteUser
    ): Promise<void> => instancia.patch(ApiRoutes.patchUserRole(userId), { data }, { signal, params }),

    getUser: async (id: string, signal?: AbortSignal): Promise<AxiosResponse<User, AxiosError>> =>
        instancia.get(ApiRoutes.patchUser(id), { signal }),

    deleteUser: async (id: string, signal: AbortSignal, params: ParamsUpdateOrDeleteUser): Promise<void> =>
        instancia.delete(ApiRoutes.patchUser(id), { signal, params }),

    updateUser: async (
        { id, ...data }: DataUpdateUserInfo,
        signal: AbortSignal,
        params: ParamsUpdateOrDeleteUser
    ): Promise<void> => instancia.patch(ApiRoutes.patchUser(id), { data }, { signal, params }),

    createUsers: (data: NewUser[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getUser(), { data }, { signal }),

    //USER-ROLES
    //----------- Ainda Não utilizadas --------------
    // createUserRoles: async (data: NewUserRole[], signal?: AbortSignal): Promise<void> =>
    //     instancia.post(ApiRoutes.getUserRoles(), { data }, { signal }),

    // editUserRole: async ({ id, ...data }: EditUserRoleData, signal?: AbortSignal): Promise<void> =>
    //     instancia.patch(ApiRoutes.getUserRoles() + `/${id}`, { data }, { signal }),

    // editUserByUserRole: async ({ userRoleId, ...data }: EditUserByUserRoleData, signal?: AbortSignal): Promise<void> =>
    //     instancia.patch(ApiRoutes.getUserRoles() + `/${userRoleId}/user`, { data }, { signal }),

    // deleteUserRole: async (id: string, signal?: AbortSignal): Promise<void> =>
    //     instancia.delete(ApiRoutes.getUserRoles() + `/${id}`, { signal }),

    // getUserRole: async (
    //     id: string,
    //     params?: { where: { role?: Role } },
    //     signal?: AbortSignal
    // ): Promise<AxiosResponse<UserRole, AxiosError>> =>
    //     instancia.get(ApiRoutes.getUserRoles() + `/${id}`, { signal, params }),
    //--------------------------------------//

    findUserRoles: async (
        params?: FindUserRoleParams,
        signal?: AbortSignal
    ): Promise<AxiosResponse<UserRole[], AxiosError>> => instancia.get(ApiRoutes.getUserRoles(), { params, signal }),

    //CLIENTES
    importCustomers: (clientes: NewImportCustomer[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.importCustomers(), { data: clientes }, { signal }),

    createCustomers: (clientes: NewCustomer[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getCustomers(), { data: clientes }, { signal }),

    updateCustomer: async ({ id, ...data }: EditCustomerData, signal?: AbortSignal): Promise<void> =>
        instancia.patch(ApiRoutes.patchCustomer(id), { data }, { signal }),

    deleteCustomer: async (id: string, signal?: AbortSignal): Promise<void> =>
        instancia.delete(ApiRoutes.patchCustomer(id), { signal }),

    getCustomer: async (id: string, signal?: AbortSignal): Promise<AxiosResponse<Customer, AxiosError>> =>
        instancia.get(ApiRoutes.patchCustomer(id), { signal }),

    findCustomers: async (
        params?: CustomerQueryProps,
        signal?: AbortSignal
    ): Promise<AxiosResponse<Customer[], AxiosError>> => instancia.get(ApiRoutes.getCustomers(), { params, signal }),

    //ORGANIZATION
    updateOrganization: async ({ id, ...data }: EditOrganizationData, signal?: AbortSignal): Promise<void> =>
        instancia.patch(
            ApiRoutes.patchOrganization(id),
            { data },
            { signal, headers: { "Content-Type": "multipart/form-data" } }
        ),

    findOrganizations: async (
        params?: OrganizationQueryProps,
        signal?: AbortSignal
    ): Promise<AxiosResponse<Organization[], AxiosError>> =>
        instancia.get(ApiRoutes.getOrganizations(), { params, signal }),

    //FORNECEDORES
    createSuppliers: async (suppliers: NewSupplier[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getSuppliers(), { data: suppliers }, { signal }),

    updateSupplier: async ({ id, ...data }: EditSupplierData, signal?: AbortSignal): Promise<void> =>
        instancia.patch(ApiRoutes.patchSupplier(id), { data }, { signal }),

    deleteSupplier: async (id: string, signal?: AbortSignal): Promise<void> =>
        instancia.delete(ApiRoutes.patchSupplier(id), { signal }),

    getSupplier: async (id: string, signal?: AbortSignal): Promise<AxiosResponse<Supplier, AxiosError>> =>
        instancia.get(ApiRoutes.patchSupplier(id), { signal }),

    findSuppliers: async (
        params?: FindSuppliersParams,
        signal?: AbortSignal
    ): Promise<AxiosResponse<Supplier[], AxiosError>> => instancia.get(ApiRoutes.getSuppliers(), { params, signal }),

    //PRODUTOS
    createProduct: async (produtos: tNovoProduto[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getProducts(), { data: produtos }, { signal }),

    updateProduct: async ({ id, ...data }: tNovoProduto & { id: string }, signal?: AbortSignal): Promise<void> =>
        instancia.patch(ApiRoutes.patchProduct(id), { data }, { signal }),

    deleteProduct: async (id: string, signal?: AbortSignal): Promise<void> =>
        instancia.delete(ApiRoutes.patchProduct(id), { signal }),

    getProduct: async (id: string, signal?: AbortSignal): Promise<AxiosResponse<tProduto, AxiosError>> =>
        instancia.get(ApiRoutes.patchProduct(id), { signal }),

    findProducts: async (
        params?: FindProductsParams,
        signal?: AbortSignal
    ): Promise<AxiosResponse<tProduto[], AxiosError>> => instancia.get(ApiRoutes.getProducts(), { params, signal }),

    //SERVICOS
    createService: async (servicos: tNovoServico[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getServices(), { data: servicos }, { signal }),

    updateService: async ({ id, ...data }: tNovoServico & { id: string }, signal?: AbortSignal): Promise<void> =>
        instancia.patch(ApiRoutes.patchService(id), { data }, { signal }),

    deleteService: async (id: string, signal?: AbortSignal): Promise<void> =>
        instancia.delete(ApiRoutes.patchService(id), { signal }),

    getService: async (id: string, signal?: AbortSignal): Promise<AxiosResponse<tServico, AxiosError>> =>
        instancia.get(ApiRoutes.patchService(id), { signal }),

    findServices: async (
        params?: FindServicesParams,
        signal?: AbortSignal
    ): Promise<AxiosResponse<tServico[], AxiosError>> => instancia.get(ApiRoutes.getServices(), { params, signal }),

    //CATEGORIAS-PRODUTOS
    createCategory: async (categorias: tNovaCategoria[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getCategorys(), { data: categorias }, { signal }),

    updateCategory: async ({ id, ...data }: tNovaCategoria & { id: string }, signal?: AbortSignal): Promise<void> =>
        instancia.patch(ApiRoutes.patchCategory(id), { data }, { signal }),

    deleteCategory: async (id: string, signal?: AbortSignal): Promise<void> =>
        instancia.delete(ApiRoutes.patchCategory(id), { signal }),

    getCategory: async (id: string, signal?: AbortSignal): Promise<AxiosResponse<tCategoria, AxiosError>> =>
        instancia.get(ApiRoutes.patchCategory(id), { signal }),

    findCategories: async (signal?: AbortSignal): Promise<AxiosResponse<tCategoria[], AxiosError>> =>
        instancia.get(ApiRoutes.getCategorys(), { signal }),

    //CONTRATO
    createContract: async (contratos: tNovoContrato[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getContracts(), { data: contratos }, { signal }),

    updateContract: async ({ id, ...data }: tNovoContrato & { id: string }, signal?: AbortSignal): Promise<void> =>
        instancia.patch(ApiRoutes.patchContract(id), { data }, { signal }),

    deleteContract: async (id: string, signal?: AbortSignal): Promise<void> =>
        instancia.delete(ApiRoutes.patchContract(id), { signal }),

    getContract: async (id: string, signal?: AbortSignal): Promise<AxiosResponse<tContrato, AxiosError>> =>
        instancia.get(ApiRoutes.patchContract(id), { signal }),

    findContracts: async (
        params?: tQueryParamsContrato,
        signal?: AbortSignal
    ): Promise<AxiosResponse<tContrato[], AxiosError>> => instancia.get(ApiRoutes.getContracts(), { params, signal }),

    //FORMA PAGAMENTO
    insertFormaPagamento: async (categorias: tNovaFormaPagamento[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getPaymentMethods(), { data: categorias }, { signal }),

    editarFormaPagamento: async (
        { id, ...data }: tNovaFormaPagamento & { id: string },
        signal?: AbortSignal
    ): Promise<void> => instancia.patch(ApiRoutes.patchPaymentMethod(id), { data }, { signal }),

    deletarFormaPagamento: async (id: string, signal?: AbortSignal): Promise<void> =>
        instancia.delete(ApiRoutes.patchPaymentMethod(id), { signal }),

    getFormaPagamento: async (id: string, signal?: AbortSignal): Promise<AxiosResponse<tFormaPagamento, AxiosError>> =>
        instancia.get(ApiRoutes.patchPaymentMethod(id), { signal }),

    listaFormasPagamento: async (
        params?: tQueryParamsFormaPagamento,
        signal?: AbortSignal
    ): Promise<AxiosResponse<tFormaPagamento[], AxiosError>> =>
        instancia.get(ApiRoutes.getPaymentMethods(), { params, signal }),

    //SEGMENTOS-CLIENTES
    createSegment: async (segmentos: tNovoSegmento[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getSegments(), { data: segmentos }, { signal }),

    updateSegment: async ({ id, ...data }: tNovoSegmento & { id: string }, signal?: AbortSignal): Promise<void> =>
        instancia.patch(ApiRoutes.patchSegment(id), { data }, { signal }),

    deleteSegment: async (id: string, signal?: AbortSignal): Promise<void> =>
        instancia.delete(ApiRoutes.patchSegment(id), { signal }),

    getSegment: async (id: string, signal?: AbortSignal): Promise<AxiosResponse<tSegmento, AxiosError>> =>
        instancia.get(ApiRoutes.patchSegment(id), { signal }),

    findSegments: async (signal?: AbortSignal): Promise<AxiosResponse<tSegmento[], AxiosError>> =>
        instancia.get(ApiRoutes.getSegments(), { signal }),

    //TIPOS-PRODUTOS-SERVICOS
    createTypeProdServ: async (tiposProdServ: tNovoTipoProdutoServico[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getProductServiceType(), { data: tiposProdServ }, { signal }),

    updateTypeProdServ: async (
        { id, ...data }: tNovoTipoProdutoServico & { id: string },
        signal?: AbortSignal
    ): Promise<void> => instancia.patch(ApiRoutes.patchProductServiceType(id), { data }, { signal }),

    deleteTypeProdServ: async (id: string, signal?: AbortSignal): Promise<void> =>
        instancia.delete(ApiRoutes.patchProductServiceType(id), { signal }),

    getTypeProdServ: async (
        id: string,
        signal?: AbortSignal
    ): Promise<AxiosResponse<tTipoProdutoServico, AxiosError>> =>
        instancia.get(ApiRoutes.patchProductServiceType(id), { signal }),

    findTypesProdServ: async (signal?: AbortSignal): Promise<AxiosResponse<tTipoProdutoServico[], AxiosError>> =>
        instancia.get(ApiRoutes.getProductServiceType(), { signal }),

    //FABRICANTES-PRODUTOS
    createManufacturer: async (fabricantes: tNovoFabricante[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getManufacturers(), { data: fabricantes }, { signal }),

    updateManufacturer: async ({ id, ...data }: tNovoFabricante & { id: string }, signal?: AbortSignal) =>
        instancia.patch(ApiRoutes.patchManufacturer(id), { data }, { signal }),

    deleteManufacturer: async (id: string, signal?: AbortSignal): Promise<void> =>
        instancia.delete(ApiRoutes.patchManufacturer(id), { signal }),

    getManufacturer: async (id: string, signal?: AbortSignal): Promise<AxiosResponse<tFabricante, AxiosError>> =>
        instancia.get(ApiRoutes.patchManufacturer(id), { signal }),

    findManufacturers: async (signal?: AbortSignal): Promise<AxiosResponse<tFabricante[], AxiosError>> =>
        instancia.get(ApiRoutes.getManufacturers(), { signal }),

    //DISTRIBUIÇÔES
    createCommissionsDistributions: async (data: NewCommissionDistribution[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getCommissionsDistributions(), { data }, { signal }),

    editCommissionDistribution: async (
        { id, ...data }: EditCommissionDistributionData,
        signal?: AbortSignal
    ): Promise<void> => instancia.patch(ApiRoutes.patchCommissionsDistribution(id), { data }, { signal }),

    deleteCommissionDistribution: async (id: string, signal?: AbortSignal): Promise<void> =>
        instancia.delete(ApiRoutes.patchCommissionsDistribution(id), { signal }),

    getCommissionDistribution: async (
        id: string,
        signal?: AbortSignal
    ): Promise<AxiosResponse<CommissionDistribution, AxiosError>> =>
        instancia.get(ApiRoutes.patchCommissionsDistribution(id), { signal }),

    findCommissionDistributions: async (
        params?: CommissionDistributionQueryProps,
        signal?: AbortSignal
    ): Promise<AxiosResponse<CommissionDistribution[], AxiosError>> =>
        instancia.get(ApiRoutes.getCommissionsDistributions(), { params, signal }),

    //METAS
    createTargets: async (targets: NewTarget[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getTargets(), { data: targets }, { signal }),

    updateTarget: async ({ id, ...data }: DataUpdateTarget, signal?: AbortSignal): Promise<void> =>
        instancia.patch(ApiRoutes.patchTarget(id), { data }, { signal }),

    deleteTarget: async (id: string, signal?: AbortSignal): Promise<void> =>
        instancia.delete(ApiRoutes.deleteTarget(id), { signal }),

    getTarget: async (id: string, signal?: AbortSignal): Promise<AxiosResponse<Target, AxiosError>> =>
        instancia.get(ApiRoutes.patchTarget(id), { signal }),

    findTargets: async (
        params?: TargetQueryProps,
        signal?: AbortSignal
    ): Promise<AxiosResponse<Target[], AxiosError>> => instancia.get(ApiRoutes.getTargets(), { params, signal }),

    //METAS-EMPRESA
    createOrganizationEmpresa: async (targets: NewOrganizationTarget[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getOrganizationTargets(), { data: targets }, { signal }),

    updateOrganizationEmpresa: async (
        { id, ...data }: DataUpdateOrganizationTarget,
        signal?: AbortSignal
    ): Promise<void> => instancia.patch(ApiRoutes.patchOrganizationTarget(id), { data }, { signal }),

    deleteOrganizationEmpresa: async (id: string, signal?: AbortSignal): Promise<void> =>
        instancia.delete(ApiRoutes.deleteOrganizationTarget(id), { signal }),

    getOrganizationEmpresa: async (
        id: string,
        signal?: AbortSignal
    ): Promise<AxiosResponse<OrganizationTarget, AxiosError>> =>
        instancia.get(ApiRoutes.patchOrganizationTarget(id), { signal }),

    findOrganizationTargets: async (
        params?: OrganizationTargetQueryProps,
        signal?: AbortSignal
    ): Promise<AxiosResponse<OrganizationTarget[], AxiosError>> =>
        instancia.get(ApiRoutes.getOrganizationTargets(), { params, signal }),

    //RELATORIOS
    getSalesClientReports: async (
        salesIds?: string[],
        params?: GetSalesReportParams,
        signal?: AbortSignal
    ): Promise<AxiosResponse<Blob, AxiosError>> =>
        instancia.post(ApiRoutes.getReportSalesClient(), { salesIds }, { params, signal, responseType: "blob" }),

    getSalesUserReports: async (
        salesIds?: string[],
        params?: GetSalesReportParams,
        signal?: AbortSignal
    ): Promise<AxiosResponse<Blob, AxiosError>> =>
        instancia.post(ApiRoutes.getReportSalesUser(), { salesIds }, { params, signal, responseType: "blob" }),

    getCommissionReports: async (
        commissionsIds?: string[],
        params?: GetCommissionReportParams,
        signal?: AbortSignal
    ): Promise<AxiosResponse<Blob, AxiosError>> =>
        instancia.post(ApiRoutes.getCommissionsReports(), { commissionsIds }, { params, signal, responseType: "blob" }),

    getVisitReport: async (
        visitsIds: string[],
        params?: GetVisitReportParams,
        signal?: AbortSignal
    ): Promise<AxiosResponse<Blob, AxiosError>> =>
        instancia.post(ApiRoutes.getVisitsReport(), { visitsIds }, { params, signal, responseType: "blob" }),

    getUserReports: async (
        usersIds?: string[],
        params?: GetUserReportParams,
        signal?: AbortSignal
    ): Promise<AxiosResponse<Blob, AxiosError>> =>
        instancia.post(ApiRoutes.getReportsUsers(), { usersIds }, { params, signal, responseType: "blob" }),

    //COMISSOES
    getCommission: async (id: string, signal?: AbortSignal): Promise<AxiosResponse<Commission, AxiosError>> =>
        instancia.get(ApiRoutes.patchCommission(id), { signal }),

    findComissions: async (
        params?: FindCommissionsParams,
        signal?: AbortSignal
    ): Promise<AxiosResponse<Commission[], AxiosError>> =>
        instancia.get(ApiRoutes.getCommissions(), { params, signal }),

    payOneCommission: async ({ id, ...data }: PayOneCommissioProps, signal?: AbortSignal): Promise<void> =>
        instancia.patch(ApiRoutes.patchCommission(id), { data }, { signal }),

    payManyCommissions: async (ids: string[], signal?: AbortSignal): Promise<void> =>
        instancia.patch(ApiRoutes.getCommissions(), { data: { comissoesId: ids } }, { signal }),

    approveManyCommissions: async (ids: string[], signal?: AbortSignal): Promise<void> =>
        instancia.patch(
            ApiRoutes.getCommissions() + ApiRoutes.getCommissionsApproveMany(),
            { data: { comissoesId: ids } },
            { signal }
        ),

    toggleCommissionDistributorPaid: async (
        data: DataToggleCommissionDistributorPaid,
        signal?: AbortSignal
    ): Promise<void> => instancia.patch(ApiRoutes.getCommissionsSupplierPaid(), { data }, { signal }),

    getCommissionInfoPerRole: async (
        params: GetCommissionInfoPerUserParams,
        signal?: AbortSignal
    ): Promise<AxiosResponse<CommissionInfoPerUser[], AxiosError>> =>
        instancia.get(ApiRoutes.getCommissionInfoRole(), { signal, params }),

    disableOneCommission: async (id: string, signal?: AbortSignal): Promise<void> =>
        instancia.patch(ApiRoutes.patchCommissionsDisable(id), { signal }),

    //AUDITORIA
    listaAuditorias: async (
        params?: tQueryParamsAuditoria,
        signal?: AbortSignal
    ): Promise<AxiosResponse<tAuditoria[], AxiosError>> => instancia.get(ApiRoutes.getAudit(), { params, signal }),

    //DASHBOARDS
    getDashValoresTotais: async (
        params: DashboardWhere,
        signal?: AbortSignal
    ): Promise<AxiosResponse<tDashValoresTotais, AxiosError>> =>
        instancia.get(ApiRoutes.getDashTotalValues(), { params, signal }),

    getDashEvoluces: async (
        params: DashboardWhere,
        signal?: AbortSignal
    ): Promise<AxiosResponse<tDashEvolucoes, AxiosError>> =>
        instancia.get(ApiRoutes.getDashEvolutions(), { params, signal }),

    getDashMetaAtingida: async (
        params: DashboardWhere,
        signal?: AbortSignal
    ): Promise<AxiosResponse<tDashMetaAtingida, AxiosError>> =>
        instancia.get(ApiRoutes.getDashTarget(), { params, signal }),

    getDashMargemContribuicao: async (
        params: Omit<DashboardWhere, "metrica">,
        signal?: AbortSignal
    ): Promise<AxiosResponse<tDashtMargemContribuicao, AxiosError>> =>
        instancia.get(ApiRoutes.getDashMarginContribution(), { params, signal }),

    getDashRankClientes: async (
        params: DashboardWhere,
        signal?: AbortSignal
    ): Promise<AxiosResponse<tDashRankClientePorVenda, AxiosError>> =>
        instancia.get(ApiRoutes.getDashRankCustomers(), { params, signal }),

    getDashRankVendedores: async (
        params: DashboardWhere,
        signal?: AbortSignal
    ): Promise<AxiosResponse<tDashRankVendedorPorFaturamento[], AxiosError>> =>
        instancia.get(ApiRoutes.getDashRankSalePerson(), { params, signal }),

    getDashRankCategorias: async (
        params: DashboardWhere,
        signal?: AbortSignal
    ): Promise<AxiosResponse<tDashRankCategoriaPorVenda, AxiosError>> =>
        instancia.get(ApiRoutes.getDashRankCategory(), { params, signal }),

    //Os dois graficos evoluções estão sendo passados pelo DashEvoluces
    // getDashEvolucaoFaturamento: async (
    //     params: DashboardWhere,
    //     signal?: AbortSignal
    // ): Promise<AxiosResponse<tDashEvolucaoFaturamento, AxiosError>> =>
    //     instancia.get(`/dashboards/evolucao-faturamento`, { params, signal }),

    // getDashEvolucaoTicketMedio: async (
    //     params: DashboardWhere,
    //     signal?: AbortSignal
    // ): Promise<AxiosResponse<tDashEvolucaoTicketMedio, AxiosError>> =>
    //     instancia.get(`/dashboards/evolucao-ticket-medio`, { params, signal }),

    getDashVendasPorTipoProdServ: async (
        params: DashboardWhere,
        signal?: AbortSignal
    ): Promise<AxiosResponse<tDashVendaPorTiposProdServ, AxiosError>> =>
        instancia.get(ApiRoutes.getDashProductServiceType(), { params, signal }),

    //VISITAS
    createVisits: async (data: NewVisit[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getVisits(), { data }, { signal }),

    updateVisit: async (
        { id, ...data }: EditVisitData,
        params?: VisitDeleteOrUpdateParams,
        signal?: AbortSignal
    ): Promise<void> => instancia.patch(ApiRoutes.patchVisit(id), { data }, { signal, params }),

    payVisits: async (visitasId: string[], signal?: AbortSignal): Promise<void> =>
        instancia.patch(ApiRoutes.getVisits(), { data: { visitasId } }, { signal }),

    deleteVisit: async (id: string, params?: VisitDeleteOrUpdateParams, signal?: AbortSignal): Promise<void> =>
        instancia.delete(ApiRoutes.patchVisit(id), { signal, params }),

    getVisit: async (id: string, signal?: AbortSignal): Promise<AxiosResponse<Visit, AxiosError>> =>
        instancia.get(ApiRoutes.patchVisit(id), { signal }),

    findVisits: async (params?: FindVisitsParams, signal?: AbortSignal): Promise<AxiosResponse<Visit[], AxiosError>> =>
        instancia.get(ApiRoutes.getVisits(), { params, signal }),

    getExpensesInfoPerRole: async (
        params: GetVisitExpensesInfoPerRole,
        signal?: AbortSignal
    ): Promise<AxiosResponse<VisitExpenseInfoPerRole[], AxiosError>> =>
        instancia.get(ApiRoutes.getVisits() + ApiRoutes.getExpenseRoleVisits(), { signal, params }),

    //VENDAS
    createSales: async (data: NewSale[], signal?: AbortSignal): Promise<void> =>
        instancia.post(ApiRoutes.getSales(), { data }, { signal }),

    updateSale: async (
        { id, ...data }: EditSaleData,
        params: SaleUpdateParams,
        reasonRegressionStatus?: string,
        signal?: AbortSignal
    ): Promise<void> => instancia.patch(ApiRoutes.patchSale(id), { data, reasonRegressionStatus }, { params, signal }),

    deleteSale: async (id: string, params: SaleDeleteParams, signal?: AbortSignal): Promise<void> =>
        instancia.delete(ApiRoutes.deleteSale(id), { params, signal }),

    findSales: async (params?: FindSalesParams, signal?: AbortSignal): Promise<AxiosResponse<Sale[], AxiosError>> =>
        instancia.get(ApiRoutes.getSales(), { params, signal }),

    //API VERSION
    getApiVersion: async (): Promise<AxiosResponse<string, AxiosError>> => instancia.get(ApiRoutes.getPathVersion()),
};

export default api;
