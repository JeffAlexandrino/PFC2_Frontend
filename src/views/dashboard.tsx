import DashboardGraphics from "./subviews/dashboardGraphics";
import DashboardTargets from "./subviews/dashboardTargets";
import LayoutDashboard from "../layouts/LayoutDashboard";
import DashboardRanks from "./subviews/dashboardRanks";
import utils from "../utils";

import FiltroMes, { DEFAULT_END_MONTH, DEFAULT_INIT_MONTH, tPossivelMes } from "../components/filtros/FilterMonths";
import { FiltroAnos, FilterUserRoleAndRole, FiltroEstadosVenda, DropdownMetricaDashboard } from "../components";
import useDashboard, { tDadosDashboard } from "../hooks/useDashboard";
import { useContext, useEffect, useMemo, useState } from "react";
import { ContextUser } from "../contexts/ContextUser";
import { SEARCH_PARAMS_KEY } from "../lib/constants";
import { DashboardMetric } from "../types/dashboard";
import { useSearchParams } from "react-router-dom";
import { Button, Col } from "react-bootstrap";
import { SaleStatus } from "../types/sale";
import { Role } from "../types/commom";

type TActiveView = "graphics" | "ranks" | "metas";

export default function Dashboard() {
    const { canReadDashboard, currentUserRole } = useContext(ContextUser);
    const { buscaComErro, buscar, estaBuscando, cancelar } = useDashboard();

    const [metricaAtual, setMetricaAtual] = useState<DashboardMetric>(DashboardMetric.MARKUP_BRUTO);
    const [dados, setDados] = useState<null | tDadosDashboard>(null);
    const [activeView, setActiveView] = useState<TActiveView>("graphics");
    const [searchParams, setSearchParams] = useSearchParams();

    const saleStatus = (searchParams.get(SEARCH_PARAMS_KEY.SALE_STATUS) ?? undefined) as SaleStatus | undefined;
    const role = (searchParams.get(SEARCH_PARAMS_KEY.ROLE) ?? undefined) as Role | undefined;
    const userRoleId = searchParams.get(SEARCH_PARAMS_KEY.USER_ROLE_ID) ?? undefined;
    const _initMonth = searchParams.get(SEARCH_PARAMS_KEY.INIT_MONTH);
    const _endMonth = searchParams.get(SEARCH_PARAMS_KEY.END_MONTH);
    const _year = searchParams.get(SEARCH_PARAMS_KEY.YEAR);

    let hideValues : boolean = currentUserRole?.role === Role.MONITOR;

    const initMonth = _initMonth ? (Number(_initMonth) as tPossivelMes) : undefined;
    const endMonth = _endMonth ? (Number(_endMonth) as tPossivelMes) : undefined;
    const year = _year ? Number(_year) : undefined;

    const { dataInicialSelecionada: initDate, dataFinalSelecionada: endDate } = useMemo(() => {
        if (initMonth === undefined || endMonth === undefined || year === undefined)
            return { dataInicialSelecionada: undefined, dataFinalSelecionada: undefined };
        return utils.retornaDatasFiltroMesAno({ inicio: initMonth, fim: endMonth }, year);
    }, [initMonth, endMonth, year]);

    useEffect(() => {
        if (!year) searchParams.set(SEARCH_PARAMS_KEY.YEAR, String(new Date().getFullYear()));
        if (initMonth === undefined) searchParams.set(SEARCH_PARAMS_KEY.INIT_MONTH, DEFAULT_INIT_MONTH);
        if (endMonth === undefined) searchParams.set(SEARCH_PARAMS_KEY.END_MONTH, DEFAULT_END_MONTH);
        if (!role) searchParams.set(SEARCH_PARAMS_KEY.ROLE, Role.VENDEDOR);
        setSearchParams(searchParams);
    }, [searchParams, setSearchParams, role, initMonth, endMonth, year]);

    useEffect(() => {
        if (canReadDashboard({})) return;
        if (!currentUserRole) return;

        searchParams.set(SEARCH_PARAMS_KEY.USER_ROLE_ID, currentUserRole.id);
        searchParams.set(SEARCH_PARAMS_KEY.ROLE, currentUserRole.role);
    }, [role, canReadDashboard, setSearchParams, searchParams, currentUserRole]);

    useEffect(() => {
        if (!initDate || !endDate || !role) return;

        const dashboardDataUpdate = () => {
            buscar({
                role,
                dataInicio: initDate,
                dataFim: endDate,
                estadoVenda: saleStatus,
                userRoleId: userRoleId,
                metrica: utils.returnDashboardMetricKey(metricaAtual),
            })
                .then((dados) => setDados(dados))
                .catch((err) => console.error(err));
        };

        dashboardDataUpdate();
        const refreshUpdate = setInterval(dashboardDataUpdate, 60 * 60 * 1000);

        return () => {
            clearInterval(refreshUpdate);
            cancelar();
        };
    }, [initDate, endDate, role, userRoleId, saleStatus, metricaAtual, buscar, cancelar]);

    return (
        <>
            <LayoutDashboard.Root>
                <LayoutDashboard.Header>
                    <>
                        <DropdownMetricaDashboard metricaAtual={metricaAtual} setMetricaAtual={setMetricaAtual} />
                        <FiltroAnos />
                        <FiltroMes />
                        <FiltroEstadosVenda />
                        <FilterUserRoleAndRole hideValues={hideValues} />
                    </>
                </LayoutDashboard.Header>

                <div className="px-4 py-2  d-flex gap-2">
                    <Button
                        variant={activeView === "graphics" ? "primary" : "outline-primary"}
                        onClick={() => setActiveView("graphics")}
                    >
                        Gráficos
                    </Button>
                    <Button
                        variant={activeView === "ranks" ? "primary" : "outline-primary"}
                        onClick={() => setActiveView("ranks")}
                    >
                        Rankings
                    </Button>
                    <Button
                        variant={activeView === "metas" ? "primary" : "outline-primary"}
                        onClick={() => setActiveView("metas")}
                    >
                        Metas
                    </Button>
                </div>

                <LayoutDashboard.BodyRoot>
                    <LayoutDashboard.Body carregando={estaBuscando || buscaComErro}>
                        {dados && (
                            <Col md="12">
                                {activeView === "graphics" && (
                                    <DashboardGraphics
                                        metricaAtual={metricaAtual}
                                        dados={dados}
                                        hideValues={hideValues}
                                    />
                                )}
                                {activeView === "ranks" && (
                                    <DashboardRanks
                                        metricaAtual={metricaAtual}
                                        dados={dados}
                                        hideValues={hideValues}
                                    />
                                )}
                                {activeView === "metas" && (
                                    <DashboardTargets
                                        metricaAtual={metricaAtual}
                                        dados={dados}
                                        year={year}
                                        initMonth={initMonth}
                                        endMonth={endMonth}
                                        role={role}
                                        userRoleId={userRoleId}
                                        hideValues={hideValues}
                                    />
                                )}
                            </Col>
                        )}
                    </LayoutDashboard.Body>
                </LayoutDashboard.BodyRoot>
            </LayoutDashboard.Root>
        </>
    );
}
