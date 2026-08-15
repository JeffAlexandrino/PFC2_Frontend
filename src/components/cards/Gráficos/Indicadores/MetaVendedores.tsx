import { DashboardMetric } from "../../../../types/dashboard";
import { CurrencyType } from "../../../../types/commom";
import { MetaDashboardCardProps } from "../../types";

import StringUtil from "../../../../utils/string.util";
import utils from "../../../../utils";
import "./style.css";

export default function CardMetaVendedores(props: MetaDashboardCardProps) {
    const porcentMetaAtingida = props.metaAtual !== 0 ? (props.metaAtingidaAtual * 100) / props.metaAtual : null;
    const porcentMetaAtingidaAtualVsAnterior =
        props.metaAtingidaAnterior !== 0
            ? ((props.metaAtingidaAtual - props.metaAtingidaAnterior) * 100) / props.metaAtingidaAnterior
            : 0;
    const isPositive = porcentMetaAtingidaAtualVsAnterior >= 0;
    const showComparison = props.metaAtingidaAnterior != null && props.metaAtingidaAnterior !== 0;
    const textMetaAtingidaAtual =
        props.hideValues !== true
            ? props.metrica === DashboardMetric.VISITA
                ? props.metaAtingidaAtual
                : utils.retornaValorMonetario(props.metaAtingidaAtual, CurrencyType.BRL)
            : "--";
    const textMetaAtual =
        props.hideValues !== true
            ? props.metrica === DashboardMetric.VISITA
                ? props.metaAtual
                : utils.retornaValorMonetario(props.metaAtual, CurrencyType.BRL)
            : "--";

    return (
        <div className="meta-card position-relative overflow-hidden">
            <div className="d-flex flex-column h-100 justify-content-between position-relative">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <span className="meta-title d-flex flex-column">Meta</span>
                        <small className="meta-spam">{StringUtil.getDashboardMetricDescription(props.metrica)}</small>
                        <div className="text-secondary">Valor atual / Valor objetivo</div>
                    </div>
                    <div className="meta-icon d-flex align-items-center justify-content-center">
                        <i className="bi bi-crosshair" />
                    </div>
                </div>
                <div className="mt-4">
                    <h2 className="meta-value fw-bold mb-2">
                        {porcentMetaAtingida === null ? "--,--" : porcentMetaAtingida.toFixed(2)}%
                    </h2>

                    <div style={{ fontSize: "20px" }} className="meta-progress mb-3">
                        <span>{textMetaAtingidaAtual}</span>
                        <span className="meta-divider">/</span>
                        <span>{textMetaAtual}</span>
                    </div>

                    {showComparison && (
                        <div
                            className={`comparison d-inline-flex align-items-center px-3 py-2 ${
                                isPositive ? "positive" : "negative"
                            }`}
                        >
                            <i className={`bi ${isPositive ? "bi-arrow-up-right" : "bi-arrow-down-right"}`} />
                            <span>{Math.abs(porcentMetaAtingidaAtualVsAnterior).toFixed(2)}% </span>
                            <span className="comparison-period"> vs. ano anterior</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
