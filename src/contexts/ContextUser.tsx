import FrontRoutes from "../lib/front-routes";
import useUser from "../hooks/useUser";
import utils from "../utils";

import { DataUpdateUserInfo, DataUpdateUserRole, ParamsUpdateOrDeleteUser, User, UserWhere } from "../types/user";
import { ParamsCreateTarget, ParamsDeleteTarget, ParamsUpdateTarget, TargetWhere } from "../types/target";
import { EditVisit, NewVisit, Visit, VisitDeleteOrUpdateParams, VisitWhere } from "../types/visits";
import { tNovoTipoProdutoServico } from "../components/forms/FormTipoProdutoServico";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { tNovaFormaPagamento } from "../components/forms/FormFormaPagamento";
import { tNovoFabricante } from "../components/forms/FormFabricante";
import { tNovoFornecedor } from "../components/forms/FormFornecedor";
import { NewSale, SaleUpdateParams, SaleWhere } from "../types/sale";
import { tNovaCategoria } from "../components/forms/FormCategoria";
import { tNovoContrato } from "../components/forms/FormContrato";
import { tNovoSegmento } from "../components/forms/FormSegmento";
import { tNovoServico } from "../components/forms/FormServico";
import { tNovoProduto } from "../components/forms/FormProduto";
import { createMongoAbility, subject } from "@casl/ability";
import { tNovoUser } from "../components/forms/FormAdmin";
import { CommissionWhere } from "../types/commission";
import { DashboardWhere } from "../types/dashboard";
import { NewCustomer } from "../types/customer";
import { useNavigate } from "react-router-dom";
import { Actions } from "../types/commom";
import {
    PartialEntity,
    tCliente,
    tFabricante,
    tFornecedor,
    tProduto,
    tServico,
    tSubjects,
    tCategoria,
    tSegmento,
    tTipoProdutoServico,
    tComissao,
    tAuditoria,
    tFormaPagamento,
    tContrato,
} from "../interfaces";
import {
    EditUserByUserRoleData,
    NewUserRole,
    UserRole,
    UserRoleWhere,
    UserRoleWithOrganization,
} from "../types/user-role";
import {
    CommissionDistributionWhere,
    EditCommissionDistributionData,
    NewCommissionDistribution,
} from "../types/commission-distribution";

//TYPES
export interface ContextUserProps {
    children: JSX.Element;
}

//INFORMACOES DO CONTEXTO
export const ContextUser = createContext<{
    usuario: User | null;
    currentUserRole: UserRoleWithOrganization | null;
    carregandoUsuario: boolean;

    canAddUserRole: (props: Partial<NewUserRole>) => boolean;
    canEditUserByUserRole: (props: Partial<NewUserRole>) => boolean;
    canReadUserRoles: (props: UserRoleWhere) => boolean;
    canDeleteUserRole: (props: Partial<NewUserRole>) => boolean;

    canAddCustomer: (props: Partial<NewCustomer>) => boolean;
    canEditCustomer: (props: Partial<NewCustomer>) => boolean;
    canReadCustomer: (props: Partial<tCliente>) => boolean;
    canDeleteCustomer: (props: Partial<tCliente>) => boolean;

    canAddSupplier: (props: Partial<tNovoFornecedor>) => boolean;
    canEditSupplier: (props: Partial<tNovoFornecedor>) => boolean;
    canReadSupplier: (props: Partial<tFornecedor>) => boolean;
    canDeleteSupplier: (props: Partial<tFornecedor>) => boolean;

    canAddManufacturer: (props: Partial<tNovoFabricante>) => boolean;
    canEditManufacturer: (props: Partial<tNovoFabricante>) => boolean;
    canReadManufacturer: (props: Partial<tFabricante>) => boolean;
    canDeleteManufacturer: (props: Partial<tFabricante>) => boolean;

    canAddProduct: (props: Partial<tNovoProduto>) => boolean;
    canEditProduct: (props: Partial<tNovoProduto>) => boolean;
    canReadProduct: (props: Partial<tProduto>) => boolean;
    canDeleteProduct: (props: Partial<tProduto>) => boolean;

    canAddService: (props: Partial<tNovoServico>) => boolean;
    canEditService: (props: Partial<tNovoServico>) => boolean;
    canReadService: (props: Partial<tServico>) => boolean;
    canDeleteService: (props: Partial<tServico>) => boolean;

    canAddSale: (props: Partial<NewSale>) => boolean;
    canUpdateSale: (props: SaleUpdateParams & Partial<NewSale>) => boolean;
    canReadSale: (props: SaleWhere) => boolean;
    canDeleteSale: (props: SaleUpdateParams) => boolean;

    canAddTarget: (props: ParamsCreateTarget) => boolean;
    canUpdateTarget: (props: ParamsUpdateTarget) => boolean;
    canReadTarget: (props: TargetWhere) => boolean;
    canDeleteTarget: (props: ParamsDeleteTarget) => boolean;

    canAddCategory: (props: Partial<tNovaCategoria>) => boolean;
    canEditCategory: (props: Partial<tNovaCategoria>) => boolean;
    canReadCategory: (props: Partial<tCategoria>) => boolean;
    canDeleteCategory: (props: Partial<tCategoria>) => boolean;

    canAddContract: (props: Partial<tNovoContrato>) => boolean;
    canEditContract: (props: Partial<tNovoContrato>) => boolean;
    canReadContract: (props: Partial<tContrato>) => boolean;
    canDeleteContract: (props: Partial<tContrato>) => boolean;

    canAddSegment: (props: Partial<tNovoSegmento>) => boolean;
    canEditSegment: (props: Partial<tNovoSegmento>) => boolean;
    canReadSegment: (props: Partial<tSegmento>) => boolean;
    canDeleteSegment: (props: Partial<tSegmento>) => boolean;

    canAddTypeProductService: (props: Partial<tNovoTipoProdutoServico>) => boolean;
    canEditTypeProductService: (props: Partial<tNovoTipoProdutoServico>) => boolean;
    canReadTypeProductService: (props: Partial<tTipoProdutoServico>) => boolean;
    canDeleteTypeProductService: (props: Partial<tTipoProdutoServico>) => boolean;

    canAddUser: (props: Partial<tNovoUser>) => boolean;
    canUpdateUser: (props: Partial<DataUpdateUserInfo & DataUpdateUserRole & ParamsUpdateOrDeleteUser>) => boolean;
    canReadUser: (props: Partial<UserWhere>) => boolean;
    canDeleteUser: (props: ParamsUpdateOrDeleteUser) => boolean;

    canReadCommission: (props: Partial<CommissionWhere>) => boolean;
    canEditCommission: (props: Partial<PartialEntity<tComissao, "comissaoPaga" | "id">>) => boolean;

    canReadAudit: (props: Partial<tAuditoria>) => boolean;

    canAddPaymentMethod: (props: Partial<tNovaFormaPagamento>) => boolean;
    canEditPaymentMethod: (props: Partial<tNovaFormaPagamento>) => boolean;
    canReadPaymentMethod: (props: Partial<tFormaPagamento>) => boolean;
    canDeletePaymentMethod: (props: Partial<tFormaPagamento>) => boolean;

    canAddCommissionDistribution: (props: Partial<NewCommissionDistribution>) => boolean;
    canEditCommissionDistribution: (props: Partial<EditCommissionDistributionData>) => boolean;
    canReadCommissionDistribution: (props: CommissionDistributionWhere) => boolean;
    canDeleteCommissionDistribution: (props: CommissionDistributionWhere) => boolean;

    canAddVisit: (props: Partial<NewVisit>) => boolean;
    canEditVisit: (props: Partial<EditVisit> & VisitDeleteOrUpdateParams) => boolean;
    canReadVisit: (props: VisitWhere) => boolean;
    canDeleteVisit: (props: Partial<Visit> & VisitDeleteOrUpdateParams) => boolean;

    canReadDashboard: (where: Partial<DashboardWhere>) => boolean;
}>({
    usuario: null,
    currentUserRole: null,
    carregandoUsuario: false,

    canAddUserRole: () => false,
    canEditUserByUserRole: () => false,
    canReadUserRoles: () => false,
    canDeleteUserRole: () => false,

    canAddCustomer: () => false,
    canEditCustomer: () => false,
    canReadCustomer: () => false,
    canDeleteCustomer: () => false,

    canAddSupplier: () => false,
    canEditSupplier: () => false,
    canReadSupplier: () => false,
    canDeleteSupplier: () => false,

    canAddManufacturer: () => false,
    canEditManufacturer: () => false,
    canReadManufacturer: () => false,
    canDeleteManufacturer: () => false,

    canAddProduct: () => false,
    canEditProduct: () => false,
    canReadProduct: () => false,
    canDeleteProduct: () => false,

    canAddService: () => false,
    canEditService: () => false,
    canReadService: () => false,
    canDeleteService: () => false,

    canAddSale: () => false,
    canUpdateSale: () => false,
    canReadSale: () => false,
    canDeleteSale: () => false,

    canAddTarget: () => false,
    canUpdateTarget: () => false,
    canReadTarget: () => false,
    canDeleteTarget: () => false,

    canAddCategory: () => false,
    canEditCategory: () => false,
    canReadCategory: () => false,
    canDeleteCategory: () => false,

    canAddContract: () => false,
    canEditContract: () => false,
    canReadContract: () => false,
    canDeleteContract: () => false,

    canAddSegment: () => false,
    canEditSegment: () => false,
    canReadSegment: () => false,
    canDeleteSegment: () => false,

    canAddTypeProductService: () => false,
    canEditTypeProductService: () => false,
    canReadTypeProductService: () => false,
    canDeleteTypeProductService: () => false,

    canAddUser: () => false,
    canUpdateUser: () => false,
    canReadUser: () => false,
    canDeleteUser: () => false,

    canReadCommission: () => false,
    canEditCommission: () => false,

    canReadAudit: () => false,

    canAddPaymentMethod: () => false,
    canEditPaymentMethod: () => false,
    canReadPaymentMethod: () => false,
    canDeletePaymentMethod: () => false,

    canAddCommissionDistribution: () => false,
    canEditCommissionDistribution: () => false,
    canReadCommissionDistribution: () => false,
    canDeleteCommissionDistribution: () => false,

    canAddVisit: () => false,
    canEditVisit: () => false,
    canReadVisit: () => false,
    canDeleteVisit: () => false,

    canReadDashboard: () => false,
});

export default function ProviderUser(props: ContextUserProps) {
    //CONTEXTOS
    const navigate = useNavigate();
    const { getInfo, isGettingInfo, cancelar } = useUser();

    //ESTADOS
    const [usuario, setUsuario] = useState<User | null>(null);
    const [regrasDeHabilidades, setRegrasDeHabilidades] = useState<any[]>([]);
    const [currentUserRole, setCurrentUserRole] = useState<null | UserRoleWithOrganization>(null);

    //VARIVEIS
    const habilidades = useMemo(() => createMongoAbility<[Actions, any]>(regrasDeHabilidades), [regrasDeHabilidades]);

    const canAddUserRole = useCallback(
        (props: Partial<NewUserRole>): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("UserRole", props));
        },
        [habilidades]
    );
    const canEditUserByUserRole = useCallback(
        (props: Partial<EditUserByUserRoleData>): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("UserRole", props));
        },
        [habilidades]
    );
    const canReadUserRoles = useCallback(
        (props: UserRoleWhere): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("UserRole", props));
        },
        [habilidades]
    );
    const canDeleteUserRole = useCallback(
        (props: Partial<UserRole>): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("UserRole", props));
        },
        [habilidades]
    );

    const canAddCustomer = useCallback(
        (props: Partial<NewCustomer>): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("Cliente", props));
        },
        [habilidades]
    );
    const canEditCustomer = useCallback(
        (props: Partial<NewCustomer>): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("Cliente", props));
        },
        [habilidades]
    );
    const canReadCustomer = useCallback(
        (props: Partial<tCliente>): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("Fornecedor", props));
        },
        [habilidades]
    );
    const canDeleteCustomer = useCallback(
        (props: Partial<tCliente>): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("Cliente", props));
        },
        [habilidades]
    );

    const canAddSupplier = useCallback(
        (props: Partial<tNovoFornecedor>): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("Fornecedor", props));
        },
        [habilidades]
    );
    const canEditSupplier = useCallback(
        (props: Partial<tNovoFornecedor>): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("Fornecedor", props));
        },
        [habilidades]
    );
    const canReadSupplier = useCallback(
        (props: Partial<tFornecedor>): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("Fornecedor", props));
        },
        [habilidades]
    );
    const canDeleteSupplier = useCallback(
        (props: Partial<tFornecedor>): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("Fornecedor", props));
        },
        [habilidades]
    );

    const canAddManufacturer = useCallback(
        (props: Partial<tNovoFabricante>): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("Fabricante", props));
        },
        [habilidades]
    );
    const canEditManufacturer = useCallback(
        (props: Partial<tNovoFabricante>): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("Fabricante", props));
        },
        [habilidades]
    );
    const canReadManufacturer = useCallback(
        (props: Partial<tFabricante>): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("Fabricante", props));
        },
        [habilidades]
    );
    const canDeleteManufacturer = useCallback(
        (props: Partial<tFabricante>): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("Fabricante", props));
        },
        [habilidades]
    );

    const canAddProduct = useCallback(
        (props: Partial<tNovoProduto>): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("Produto", props));
        },
        [habilidades]
    );
    const canEditProduct = useCallback(
        (props: Partial<tNovoProduto>): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("Produto", props));
        },
        [habilidades]
    );
    const canReadProduct = useCallback(
        (props: Partial<tProduto>): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("Produto", props));
        },
        [habilidades]
    );
    const canDeleteProduct = useCallback(
        (props: Partial<tProduto>): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("Produto", props));
        },
        [habilidades]
    );

    const canAddService = useCallback(
        (props: Partial<tNovoServico>): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("Servico", props));
        },
        [habilidades]
    );
    const canEditService = useCallback(
        (props: Partial<tNovoServico>): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("Servico", props));
        },
        [habilidades]
    );
    const canReadService = useCallback(
        (props: Partial<tServico>): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("Servico", props));
        },
        [habilidades]
    );
    const canDeleteService = useCallback(
        (props: Partial<tServico>): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("Servico", props));
        },
        [habilidades]
    );

    const canAddSale = useCallback(
        (props: Partial<NewSale>): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("Venda", props));
        },
        [habilidades]
    );
    const canUpdateSale = useCallback(
        (props: SaleUpdateParams & Partial<NewSale>): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("Venda", props));
        },
        [habilidades]
    );
    const canReadSale = useCallback(
        (props: SaleWhere): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("Venda", props));
        },
        [habilidades]
    );
    const canDeleteSale = useCallback(
        (props: SaleUpdateParams): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("Venda", props));
        },
        [habilidades]
    );

    const canAddTarget = useCallback(
        (props: ParamsCreateTarget): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("Meta", props));
        },
        [habilidades]
    );
    const canUpdateTarget = useCallback(
        (props: ParamsUpdateTarget): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("Meta", props));
        },
        [habilidades]
    );
    const canReadTarget = useCallback(
        (props: TargetWhere): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("Meta", props));
        },
        [habilidades]
    );
    const canDeleteTarget = useCallback(
        (props: ParamsDeleteTarget): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("Meta", props));
        },
        [habilidades]
    );

    const canAddCategory = useCallback(
        (props: Partial<tNovaCategoria>): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("Categoria", props));
        },
        [habilidades]
    );
    const canEditCategory = useCallback(
        (props: Partial<tNovaCategoria>): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("Categoria", props));
        },
        [habilidades]
    );
    const canReadCategory = useCallback(
        (props: Partial<tCategoria>): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("Categoria", props));
        },
        [habilidades]
    );
    const canDeleteCategory = useCallback(
        (props: Partial<tCategoria>): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("Categoria", props));
        },
        [habilidades]
    );

    const canAddContract = useCallback(
        (props: Partial<tNovoContrato>): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("Contrato", props));
        },
        [habilidades]
    );
    const canEditContract = useCallback(
        (props: Partial<tNovoContrato>): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("Contrato", props));
        },
        [habilidades]
    );
    const canReadContract = useCallback(
        (props: Partial<tContrato>): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("Contrato", props));
        },
        [habilidades]
    );
    const canDeleteContract = useCallback(
        (props: Partial<tContrato>): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("Contrato", props));
        },
        [habilidades]
    );

    const canAddTypeProductService = useCallback(
        (props: Partial<tNovoTipoProdutoServico>): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("TipoProdutoServico", props));
        },
        [habilidades]
    );
    const canEditTypeProductService = useCallback(
        (props: Partial<tNovoTipoProdutoServico>): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("TipoProdutoServico", props));
        },
        [habilidades]
    );
    const canReadTypeProductService = useCallback(
        (props: Partial<tTipoProdutoServico>): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("TipoProdutoServico", props));
        },
        [habilidades]
    );
    const canDeleteTypeProductService = useCallback(
        (props: Partial<tTipoProdutoServico>): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("TipoProdutoServico", props));
        },
        [habilidades]
    );

    const canAddSegment = useCallback(
        (props: Partial<tNovoSegmento>): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("Segmento", props));
        },
        [habilidades]
    );
    const canEditSegment = useCallback(
        (props: Partial<tNovoSegmento>): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("Segmento", props));
        },
        [habilidades]
    );
    const canReadSegment = useCallback(
        (props: Partial<tSegmento>): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("Segmento", props));
        },
        [habilidades]
    );
    const canDeleteSegment = useCallback(
        (props: Partial<tSegmento>): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("Segmento", props));
        },
        [habilidades]
    );

    const canAddUser = useCallback(
        (props: Partial<tNovoUser>): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("User", props));
        },
        [habilidades]
    );
    const canUpdateUser = useCallback(
        (props: Partial<DataUpdateUserInfo & DataUpdateUserRole & ParamsUpdateOrDeleteUser>): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("User", props));
        },
        [habilidades]
    );
    const canReadUser = useCallback(
        (props: Partial<UserWhere>): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("User", props));
        },
        [habilidades]
    );
    const canDeleteUser = useCallback(
        (props: ParamsUpdateOrDeleteUser): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("User", props));
        },
        [habilidades]
    );

    const canReadCommission = useCallback(
        (props: Partial<CommissionWhere> & { dataInicio?: Date; dataFim?: Date }) => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("Comissao", props));
        },
        [habilidades]
    );
    const canEditCommission = useCallback(
        (props: Partial<PartialEntity<tComissao, "id" | "dataComissao">>) => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("Comissao", props));
        },
        [habilidades]
    );

    const canReadAudit = useCallback(
        (props: Partial<tAuditoria>) => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("Auditoria", props));
        },
        [habilidades]
    );

    const canAddPaymentMethod = useCallback(
        (props: Partial<tNovaFormaPagamento>): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("FormaPagamento", props));
        },
        [habilidades]
    );
    const canEditPaymentMethod = useCallback(
        (props: Partial<tNovaFormaPagamento>): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("FormaPagamento", props));
        },
        [habilidades]
    );
    const canReadPaymentMethod = useCallback(
        (props: Partial<tFormaPagamento>): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("FormaPagamento", props));
        },
        [habilidades]
    );
    const canDeletePaymentMethod = useCallback(
        (props: Partial<tFormaPagamento>): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("FormaPagamento", props));
        },
        [habilidades]
    );

    const canAddCommissionDistribution = useCallback(
        (props: Partial<NewCommissionDistribution>): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("DistribuicaoComissao", props));
        },
        [habilidades]
    );
    const canEditCommissionDistribution = useCallback(
        (props: Partial<EditCommissionDistributionData>): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("DistribuicaoComissao", props));
        },
        [habilidades]
    );
    const canReadCommissionDistribution = useCallback(
        (props: CommissionDistributionWhere): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("DistribuicaoComissao", props));
        },
        [habilidades]
    );
    const canDeleteCommissionDistribution = useCallback(
        (props: CommissionDistributionWhere): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("DistribuicaoComissao", props));
        },
        [habilidades]
    );

    const canAddVisit = useCallback(
        (props: Partial<NewVisit>): boolean => {
            return habilidades.can(Actions.CREATE, subject<tSubjects, any>("Visita", props));
        },
        [habilidades]
    );
    const canEditVisit = useCallback(
        (props: Partial<EditVisit> & VisitDeleteOrUpdateParams): boolean => {
            return habilidades.can(Actions.UPDATE, subject<tSubjects, any>("Visita", props));
        },
        [habilidades]
    );
    const canReadVisit = useCallback(
        (props: VisitWhere): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("Visita", props));
        },
        [habilidades]
    );
    const canDeleteVisit = useCallback(
        (props: Partial<Visit> & VisitDeleteOrUpdateParams): boolean => {
            return habilidades.can(Actions.DELETE, subject<tSubjects, any>("Visita", props));
        },
        [habilidades]
    );

    const canReadDashboard = useCallback(
        (props: Partial<DashboardWhere>): boolean => {
            return habilidades.can(Actions.READ, subject<tSubjects, any>("Dashboard", props));
        },
        [habilidades]
    );

    //EVENTOS
    useEffect(() => {
        getInfo()
            .then((info) => {
                setUsuario(info.user);
                setRegrasDeHabilidades(info.regrasHabilidades);
                setCurrentUserRole(info.currentUserRole);
            })
            .catch((err) => {
                if (err?.response?.status !== 401)
                    navigate(FrontRoutes.getErrorInfoUser().replace(":error", utils.retornaMensagemErro(err)));
            });

        return () => cancelar();
    }, [cancelar, getInfo, navigate]);

    return (
        <ContextUser.Provider
            value={{
                usuario,
                carregandoUsuario: isGettingInfo,
                currentUserRole,

                canAddUserRole,
                canEditUserByUserRole,
                canReadUserRoles,
                canDeleteUserRole,

                canAddCustomer,
                canEditCustomer,
                canReadCustomer,
                canDeleteCustomer,

                canAddSupplier,
                canEditSupplier,
                canReadSupplier,
                canDeleteSupplier,

                canAddManufacturer,
                canEditManufacturer,
                canReadManufacturer,
                canDeleteManufacturer,

                canAddProduct,
                canEditProduct,
                canReadProduct,
                canDeleteProduct,

                canAddService,
                canEditService,
                canReadService,
                canDeleteService,

                canAddSale,
                canUpdateSale,
                canReadSale,
                canDeleteSale,

                canAddTarget,
                canUpdateTarget,
                canReadTarget,
                canDeleteTarget,

                canAddCategory,
                canEditCategory,
                canReadCategory,
                canDeleteCategory,

                canAddContract,
                canEditContract,
                canReadContract,
                canDeleteContract,

                canAddSegment,
                canEditSegment,
                canReadSegment,
                canDeleteSegment,

                canAddTypeProductService,
                canEditTypeProductService,
                canReadTypeProductService,
                canDeleteTypeProductService,

                canAddUser,
                canUpdateUser,
                canReadUser,
                canDeleteUser,

                canReadCommission,
                canEditCommission,

                canReadAudit,

                canAddPaymentMethod,
                canEditPaymentMethod,
                canReadPaymentMethod,
                canDeletePaymentMethod,

                canAddCommissionDistribution,
                canEditCommissionDistribution,
                canReadCommissionDistribution,
                canDeleteCommissionDistribution,

                canAddVisit,
                canEditVisit,
                canReadVisit,
                canDeleteVisit,

                canReadDashboard,
            }}
        >
            {props.children}
        </ContextUser.Provider>
    );
}
