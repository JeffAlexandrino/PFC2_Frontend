import TotalValueDashboardCard from "../../components/cards/Gráficos/Indicadores/TotalValueDashboardCard";
import EvolucaoTotalDashboard from "../../components/cards/Gráficos/Visualizacoes/EvolucaoTotalDashboard";
import StringUtil from "../../utils/string.util";
import GastoComClientes from "../../components/cards/Gráficos/Indicadores/GastoComClientes";

import { tDadosDashboard } from "../../hooks/useDashboard";
import { DashboardMetric } from "../../types/dashboard";
import { CardTiposProdServ } from "../../components";
import { Col, Row } from "react-bootstrap";

interface DashboardGraphicsProps {
    metricaAtual: DashboardMetric;
    dados: tDadosDashboard;
    hideValues: boolean;
}

export default function DashboardGraphics({ metricaAtual, dados, hideValues }: DashboardGraphicsProps) {
    const hasData =
        (dados.rankCategorias !== undefined && dados.rankCategorias?.at(0)?.valorAcumulado !== 0) ||
        dados.rankClientes?.at(0)?.valorAcumulado !== 0 ||
        (dados.rankVendedores !== undefined && dados.rankVendedores?.at(0)?.valorAcumulado !== 0);

    if (!hasData) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center text-center py-5 text-muted">
                <i className="bi bi-graph-up fs-1" />
                <p className="fs-4 fw-semibold mb-0">Nenhum dado disponível</p>
                <p>
                    Não foram encontrados resultados para os filtros aplicados. <br />
                    Ajuste a métrica, período ou demais parâmetros para visualizar os gráficos.
                </p>
            </div>
        );
    }

    return (
        <Row className="g-4">
            <Col xs={12} lg={4}>
                <Row className="g-4">
                    <Col xs={12}>
                        <TotalValueDashboardCard
                            metrica={metricaAtual}
                            valoTotalAtual={dados.valoresTotais.valorTotalAtual}
                            valorTotalAnterior={dados.valoresTotais.valorTotalAnterior}
                            hideValues={hideValues}
                        />
                    </Col>

                    <Col xs={12}>
                        <GastoComClientes
                            metrica={metricaAtual}
                            valoTotalAtual={dados.valoresTotais.valorTotalAtual}
                            valorTotalAnterior={dados.valoresTotais.valorTotalAnterior}
                            hideValues={hideValues}
                            valorGasto={dados.rankClientes.reduce(
                                (acumulador, valor) => acumulador + valor.valorGasto,
                                0
                            )}
                        />
                    </Col>

                    {/* <Col xs={12}>
                        <CardTiposProdServ
                            metrica={metricaAtual}
                            dados={dados.vendasPorTipoProdServ}
                            disabledText={"Este card está inativo"}
                            hideValues={hideValues}
                        />
                    </Col> */}
                </Row>
            </Col>

            <Col xs={12} lg={8}>
                <EvolucaoTotalDashboard
                    metrica={metricaAtual}
                    anoAtual={dados.evolucoes.evolucaoAnoAtual}
                    anoAnterior={dados.evolucoes.evolucaoAnoAnterior}
                />
            </Col>
        </Row>
    );
}
