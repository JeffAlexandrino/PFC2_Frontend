import TotalTicketDashboardCard from "../../components/cards/Gráficos/Indicadores/TotalTicketDashboardCard";
import EvolucaoTicketDashboard from "../../components/cards/Gráficos/Visualizacoes/EvolucaoTicketDashboard";

import { CardTopClientes, CardTopVendedores } from "../../components";
import { tDadosDashboard } from "../../hooks/useDashboard";
import { DashboardMetric } from "../../types/dashboard";
import { Col, Row } from "react-bootstrap";

interface DashboardRanksProps {
    metricaAtual: DashboardMetric;
    dados: tDadosDashboard;
    hideValues?: boolean;
}

export default function DashboardRanks({ metricaAtual, dados, hideValues }: DashboardRanksProps) {
    const hasData =
        (dados.evolucoes !== undefined && dados.vendasPorTipoProdServ?.at(0)?.valorAcumulado !== 0) ||
        dados.rankClientes?.at(0)?.valorAcumulado !== 0 ||
        (dados.valoresTotais !== undefined && dados.rankVendedores?.at(0)?.valorAcumulado !== 0);

    if (!hasData) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center text-center py-5 text-muted">
                <i className="bi bi-bar-chart-line fs-1" />
                <p className="fs-4 fw-semibold mb-0">Nenhum dado disponível</p>
                <p>
                    Não foram encontrados resultados para os filtros aplicados. <br />
                    Ajuste a métrica, período ou demais parâmetros para visualizar os rankings.
                </p>
            </div>
        );
    }

    return (
        <Row>
            {metricaAtual !== DashboardMetric.VISITA && dados.valoresTotais !== undefined && (
                <Col md="6" lg="4" className="mb-3">
                    <TotalTicketDashboardCard
                        ticket={{
                            metrica: metricaAtual,
                            valoTotalAtual: dados.valoresTotais.avgValorTotalAtual,
                            valorTotalAnterior: dados.valoresTotais.avgValorTotalAnterior,
                            hideValues,
                        }}
                        somaTotal={{
                            metrica: metricaAtual,
                            valoTotalAtual: dados.valoresTotais.valorTotalAtual,
                            valorTotalAnterior: dados.valoresTotais.valorTotalAnterior,
                            hideValues,
                        }}
                    />
                </Col>
            )}
            {metricaAtual !== DashboardMetric.VISITA && dados.valoresTotais !== undefined && (
                <Col md="12" lg="8" className="mb-3">
                    <EvolucaoTicketDashboard
                        metrica={metricaAtual}
                        anoAtual={dados.evolucoes.evolucaoAnoAtual}
                        anoAnterior={dados.evolucoes.evolucaoAnoAnterior}
                    />
                </Col>
            )}

            {dados.rankClientes?.at(0)?.valorAcumulado !== 0 && (
                <Col md="12" lg="6" className="mb-3">
                    <CardTopClientes metrica={metricaAtual} dados={dados.rankClientes} />
                </Col>
            )}

            {dados.rankVendedores !== undefined && dados.rankVendedores?.at(0)?.valorAcumulado !== 0 && (
                <Col md="12" lg="6" className="mb-3">
                    <CardTopVendedores metrica={metricaAtual} dados={dados.rankVendedores} hideValues={hideValues} />
                </Col>
            )}

            {/* {dados.rankCategorias !== undefined && dados.rankCategorias?.at(0)?.valorAcumulado !== 0 && (
                <Col md="12" lg="4" className="mb-3">
                    <CardRankCategoriasPorVenda metrica={metricaAtual} dados={dados.rankCategorias} />
                </Col>
            )} */}
        </Row>
    );
}
