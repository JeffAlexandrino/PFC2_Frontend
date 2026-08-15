import { DashboardMetric } from "../../../../types/dashboard";
import { TotalValueDashboardCardProps } from "../../types";
import { CurrencyType } from "../../../../types/commom";

import StringUtil from "../../../../utils/string.util";
import utils from "../../../../utils";
import "./style.css";

export default function TotalValueDashboardCard(props: TotalValueDashboardCardProps) {
    const textValorTotal =
        props.hideValues !== true
            ? props.metrica === DashboardMetric.VISITA
                ? props.valoTotalAtual
                : utils.retornaValorMonetario(props.valoTotalAtual, CurrencyType.BRL)
            : "";

    const porcentValorAtualVsAnterior =
        props.valorTotalAnterior && props.valorTotalAnterior !== 0
            ? ((props.valoTotalAtual - props.valorTotalAnterior) * 100) / props.valorTotalAnterior
            : 0;

    const isPositive = porcentValorAtualVsAnterior >= 0;
    const showComparison = props.valorTotalAnterior != null && props.valorTotalAnterior !== 0;

    return (
        <div className="total-value-card position-relative overflow-hidden">
            <div className="d-flex flex-column h-100 justify-content-between position-relative">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <span className="total-value-title d-flex flex-column">Soma total</span>
                        <small className="total-value-spam">
                            {StringUtil.getDashboardMetricDescription(props.metrica)}
                        </small>
                    </div>

                    <div className="total-value-icon d-flex align-items-center justify-content-center">
                        <i
                            className={`bi ${
                                props.metrica === DashboardMetric.VISITA ? "bi-geo-fill" : "bi-cash-stack"
                            }`}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <h2 className="total-value-value fw-bold mb-2">{textValorTotal}</h2>
                    {showComparison && (
                        <div
                            className={`total-value-comparison d-inline-flex align-items-center px-3 py-2 ${
                                isPositive ? "positive" : "negative"
                            }`}
                        >
                            <i className={`bi ${isPositive ? "bi-arrow-up-right" : "bi-arrow-down-right"}`} />
                            <span>{Math.abs(porcentValorAtualVsAnterior).toFixed(2)}%</span>
                            <span className="total-value-period">vs. ano anterior</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
