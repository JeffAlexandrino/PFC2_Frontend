export default class FrontRoutes {
    private static VERSION = process.env.REACT_APP_VERSION ?? "1";

    //Frontend Routes
    private static LOGGED = "/ambiente-logado";
    private static LOGIN = "/login";
    private static ERROR_INFO_USER = "/error-info-user/:error";
    private static RECUPERAR_SENHA = "/recuperar-senha";
    private static CRIAR_SENHA = "/criar-senha";

    private static USERS = this.LOGGED + "/usuarios";
    private static TARGETS = this.LOGGED + "/targets";
    private static SALES = this.LOGGED + "/vendas";
    private static DISTRIBUTIONS = this.LOGGED + "/distribuicoes";
    private static COMMISSIONS = this.LOGGED + "/comissoes";
    private static SUPPLIERS = this.LOGGED + "/fornecedores";
    private static DASHBOARD = this.LOGGED + "/dashboard";
    private static CUSTOMERS = this.LOGGED + "/clientes";
    private static PRODUCTS = this.LOGGED + "/produtos";
    private static SERVICES = this.LOGGED + "/servicos";
    private static METAS = this.LOGGED + "/metas";
    private static VISITS = this.LOGGED + "/visitas";

    private static TARGETS_USER = this.TARGETS + "/:userId";
    private static TARGETS_USER_ROLE = this.TARGETS + "/:userRoleId";

    public static getVersion = (): string => this.VERSION;
    public static getRouteVersion = (): string => "/v" + this.VERSION;

    public static getLogged = (): string => this.LOGGED;
    public static getLogin = (): string => this.LOGIN;
    public static getErrorInfoUser = (): string => this.ERROR_INFO_USER;
    public static getRecuperarSenha = (): string => this.RECUPERAR_SENHA;
    public static getCriarSenha = (): string => this.CRIAR_SENHA;

    public static getUsers = (): string => this.USERS;
    public static getTargets = (): string => this.TARGETS;
    public static getSales = (): string => this.SALES;
    public static getDistributions = (): string => this.DISTRIBUTIONS;
    public static getCommissions = (): string => this.COMMISSIONS;
    public static getSuppliers = (): string => this.SUPPLIERS;
    public static getDashboard = (): string => this.DASHBOARD;
    public static getCustomers = (): string => this.CUSTOMERS;
    public static getProducts = (): string => this.PRODUCTS;
    public static getServices = (): string => this.SERVICES;
    public static getVisits = (): string => this.VISITS;
    public static getMetas = (): string => this.METAS;

    public static getTargetsUser = (userId: string): string => this.TARGETS_USER.replace(":userId", userId);
    public static getTargesUserRole = (userRoleId: string): string =>
        this.TARGETS_USER_ROLE.replace(":userRoleId", userRoleId);
}
