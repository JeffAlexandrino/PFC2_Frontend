import { ContextUser } from "../../contexts/ContextUser";
import { useSearchParams } from "react-router-dom";
import { useCallback, useContext } from "react";
import { Stack } from "react-bootstrap";

import MenuLink from "../../components/links/MenuLink";
import FrontRoutes from "../../lib/front-routes";
import { Role } from "../../types/commom";

import "./styles.css";

type MenuProps = { carregando?: boolean };

export default function Menu(props: MenuProps) {
    const {
        canReadCustomer,
        canReadSupplier,
        canReadProduct,
        canReadService,
        canReadSale,
        canReadCommission,
        canReadCommissionDistribution,
        canReadVisit,

        currentUserRole,
    } = useContext(ContextUser);

    const [searchParams] = useSearchParams();

    const addFilterToPath = useCallback((path: string) => path + `?${searchParams.toString()}`, [searchParams]);

    return (
        <div className="d-flex my-div-menu-layout-principal bg-primary">
            <Stack className="d-flex w-100">
                <MenuLink
                    carregando={props.carregando}
                    nome="Dashboard"
                    path={addFilterToPath(FrontRoutes.getDashboard())}
                    icon="bar-chart-line-fill"
                />
                {(canReadSale({ salePersonId: currentUserRole?.id }) ||
                    canReadSale({ solutionArchitectId: currentUserRole?.id }) ||
                    canReadSale({ comercialAssistantId: currentUserRole?.id }) ||
                    canReadSale({ referrerId: currentUserRole?.id })) && (
                    <MenuLink
                        carregando={props.carregando}
                        nome="Vendas"
                        path={addFilterToPath(FrontRoutes.getSales())}
                        icon="basket3-fill"
                    />
                )}
                {canReadCommission({ userId: currentUserRole?.userId ?? "" }) && (
                    <MenuLink
                        carregando={props.carregando}
                        nome="Comissões"
                        path={addFilterToPath(FrontRoutes.getCommissions())}
                        icon="cash-coin"
                    />
                )}
                {canReadCommissionDistribution({ role: currentUserRole?.role }) && (
                    <MenuLink
                        carregando={props.carregando}
                        nome="Distribuições"
                        path={addFilterToPath(FrontRoutes.getDistributions())}
                        icon="bi bi-calculator-fill"
                    />
                )}
                {canReadCustomer({}) && (
                    <MenuLink
                        carregando={props.carregando}
                        nome="Clientes"
                        path={addFilterToPath(FrontRoutes.getCustomers())}
                        icon="people-fill"
                    />
                )}
                {canReadSupplier({}) && (
                    <MenuLink
                        carregando={props.carregando}
                        nome="Fornecedores"
                        path={addFilterToPath(FrontRoutes.getSuppliers())}
                        icon="building-fill"
                    />
                )}
                {canReadProduct({}) && (
                    <MenuLink
                        carregando={props.carregando}
                        nome="Produtos"
                        path={addFilterToPath(FrontRoutes.getProducts())}
                        icon="box-seam-fill"
                    />
                )}
                {canReadService({}) && (
                    <MenuLink
                        carregando={props.carregando}
                        nome="Serviços"
                        path={addFilterToPath(FrontRoutes.getServices())}
                        icon="award-fill"
                    />
                )}
                {canReadVisit({ salePersonId: currentUserRole?.id }) && (
                    <MenuLink
                    carregando={props.carregando}
                    nome="Saídas"
                    path={addFilterToPath(FrontRoutes.getVisits())}
                    icon="pin-map-fill"
                    />
                )}
                {currentUserRole?.role !== Role.MONITOR && (
                    <MenuLink
                        carregando={props.carregando}
                        nome="Metas"
                        path={addFilterToPath(FrontRoutes.getMetas())}
                        icon="bi bi-bullseye"
                    />
                )}
                {currentUserRole?.role !== Role.MONITOR && (
                    <MenuLink
                        carregando={props.carregando}
                        nome="Usuários"
                        path={addFilterToPath(FrontRoutes.getUsers())}
                        icon="person-fill"
                    />
                )}
            </Stack>
        </div>
    );
}
