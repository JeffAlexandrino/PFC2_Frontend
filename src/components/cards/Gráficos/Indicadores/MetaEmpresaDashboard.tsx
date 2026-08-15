import { DashboardMetric } from "../../../../types/dashboard";
import { CurrencyType } from "../../../../types/commom";
import { MetaTotalEmpresaDashboard } from "../../types";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import StringUtil from "../../../../utils/string.util";
import utils from "../../../../utils";

export default function MetaEmpresaGlobal(props: MetaTotalEmpresaDashboard) {
    useEffect(() => {
        setMetaGlobal(props.metaGlobalAnual ?? 0);
    }, [props.metaGlobalAnual]);

    const [metaGlobal, setMetaGlobal] = useState(props.metaGlobalAnual ?? 0);
    const metaAtingidaAtualSomada = props.metaAtingidaAtual ?? 0;

    const porcentMetaAtingida =
        props.metaGlobalAnual && props.metaGlobalAnual !== 0
            ? (metaAtingidaAtualSomada * 100) / props.metaGlobalAnual
            : null;
    const porcentMetaAtingidaAtualVsAnterior =
        props.metaAtingidaAnterior !== 0
            ? ((metaAtingidaAtualSomada - props.metaAtingidaAnterior) * 100) / props.metaAtingidaAnterior
            : 0;
    const isPositive = porcentMetaAtingidaAtualVsAnterior >= 0;
    const showComparison = props.metaAtingidaAnterior != null && props.metaAtingidaAnterior !== 0;
    const isVisitMetric = props.metrica === DashboardMetric.VISITA;
    const formatInteger = (value: number) =>
        new Intl.NumberFormat("pt-BR", {
            maximumFractionDigits: 0,
        }).format(Math.round(value));
    const formatValue = (value?: number) => {
        if (value == null) return "--";
        if (isVisitMetric) return formatInteger(value);
        return utils.retornaValorMonetario(value, CurrencyType.BRL);
    };

    const metaAtingidaAtual = formatValue(metaAtingidaAtualSomada);
    const metaObjetivo = formatValue(metaGlobal);

    return (
        <div className="meta-card">
            <Row className="align-items-center g-4">
                {/* VALORES */}
                <Col>
                    <div className="meta-title">Meta da Empresa</div>
                    <small className="meta-spam">{StringUtil.getDashboardMetricDescription(props.metrica)}</small>
                    <div className="text-secondary mb-3">Valor atual / Valor objetivo</div>

                    <h1 style={{ fontSize: "2rem" }} className="meta-value fw-bold mb-3">
                        {porcentMetaAtingida === null ? "--,--" : porcentMetaAtingida.toFixed(2)}%
                    </h1>

                    <div
                        style={{ fontSize: "1.25rem" }}
                        className="meta-progress d-flex align-items-center flex-wrap gap-2 mb-3"
                    >
                        <span>{props.hideValues === true ? "--" : metaAtingidaAtual}</span>
                        <span className="meta-divider">/</span>
                        <span className="fw-semibold">{props.hideValues === true ? "--" : metaObjetivo}</span>
                    </div>
                    {showComparison && (
                        <div
                            className={`comparison d-inline-flex align-items-center ${
                                isPositive ? "positive" : "negative"
                            }`}
                        >
                            <i className={`bi ${isPositive ? "bi-arrow-up-right" : "bi-arrow-down-right"}`} />
                            <span className="ms-2 fw-semibold">
                                {Math.abs(porcentMetaAtingidaAtualVsAnterior).toFixed(2)}%
                            </span>
                            <span className="comparison-period ms-2">vs. ano anterior</span>
                        </div>
                    )}
                </Col>

                {/* ÍCONE */}
                <Col className="d-flex justify-content-center align-items-center">
                    <div className="meta-icon position-absolute top-0 end-0 m-3">
                        <i className="bi bi-crosshair2" />
                    </div>
                </Col>
            </Row>
        </div>
    );
}
