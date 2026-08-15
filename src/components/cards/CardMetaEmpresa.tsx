import { useContext, useEffect, useState } from "react";
import { CurrencyType } from "../../types/commom";
import { Col, Form, Row } from "react-bootstrap";
import { TargetType } from "../../types/target";
import { ContextUser } from "../../contexts";
import { MetaTotalEmpresa } from "./types";

import FilterYears from "../filtros/FilterYear";
import FiltroMes from "../filtros/FilterMonths";
import utils from "../../utils";

import "./styles.css";

export default function CardMetaEmpresa(props: MetaTotalEmpresa) {
    const { canUpdateTarget } = useContext(ContextUser);
    const [metaGlobal, setMetaGlobal] = useState(props.metaGlobalAnual ?? 0);
    const isVisitTarget = props.targetTypeSelected === TargetType.VISITA;

    useEffect(() => {
        setMetaGlobal(props.metaGlobalAnual ?? 0);
    }, [props.metaGlobalAnual]);

    const porcentMetaAtingida = metaGlobal !== 0 ? (props.metaAtingidaAtual * 100) / metaGlobal : null;
    const porcentMetaAtingidaAtualVsAnterior =
        props.metaAtingidaAnterior !== 0
            ? ((props.metaAtingidaAtual - props.metaAtingidaAnterior) * 100) / props.metaAtingidaAnterior
            : 0;
    const isPositive = porcentMetaAtingidaAtualVsAnterior >= 0;
    const showComparison = props.metaAtingidaAnterior != null && props.metaAtingidaAnterior !== 0;
    const metaAtingidaAtual = props.metaAtingidaAtual
        ? isVisitTarget
            ? props.metaAtingidaAtual.toLocaleString("pt-BR", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
              })
            : utils.retornaValorMonetario(props.metaAtingidaAtual, CurrencyType.BRL)
        : "--";

    const isUpdateDisabled = props.updatingTargetEmpresa;

    return (
        <div className="mb-2 mt-2 meta-card">
            <Row className="align-items-center g-4">
                <Col lg={3}>
                    <div className="meta-title mb-1">Meta da Empresa</div>
                    <div className="text-secondary mb-3">Valor atual / Valor objetivo</div>

                    <h1 style={{ fontSize: "1.875rem" }} className="meta-value fw-bold mb-3">
                        {porcentMetaAtingida === null ? "--,--" : porcentMetaAtingida.toFixed(2)}%
                    </h1>

                    <div
                        style={{ fontSize: "1.25rem" }}
                        className="meta-progress d-flex align-items-center flex-wrap gap-2 mb-3"
                    >
                        <span>{metaAtingidaAtual}</span>
                        <span className="meta-divider">/</span>
                        <Form.Control
                            type="number"
                            min={0}
                            value={metaGlobal}
                            onChange={(e) => setMetaGlobal(Number(e.target.value) || 0)}
                            disabled={!props.onUpdateTargetEmpresa || isUpdateDisabled || !canUpdateTarget}
                            style={{ maxWidth: "11.25rem" }}
                            className="fw-semibold"
                        />
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

                <Col lg={2}>
                    <div className="d-flex flex-column gap-3">
                        <Row className="g-2">
                            <Col xs={5}>
                                <FilterYears />
                            </Col>
                            <Col xs={1}>
                                <FiltroMes />
                            </Col>
                        </Row>
                        <div>
                            <Form.Label className="fw-semibold">Tipo da meta</Form.Label>
                            <Form.Select
                                value={props.targetTypeSelected ?? ""}
                                onChange={(e) => props.onTargetTypeSelected?.(e.target.value as TargetType)}
                                disabled={!props.onTargetTypeSelected}
                                className="fw-bold text-primary"
                            >
                                {Object.values(TargetType).map((targetType) => (
                                    <option key={targetType} value={targetType}>
                                        {utils.retornaTextoTipoMeta(targetType)}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary rounded-pill border w-75"
                            disabled={isUpdateDisabled || !props.onUpdateTargetEmpresa || !canUpdateTarget}
                            onClick={() => props.onUpdateTargetEmpresa?.(metaGlobal)}
                        >
                            {isUpdateDisabled ? "Atualizando..." : "Atualizar"}
                        </button>
                    </div>
                </Col>

                <Col lg={3} className="d-flex justify-content-center align-items-center">
                    <div className="meta-icon position-absolute top-0 end-0 m-3">
                        <i className="bi bi-crosshair2" />
                    </div>
                </Col>
            </Row>
        </div>
    );
}
