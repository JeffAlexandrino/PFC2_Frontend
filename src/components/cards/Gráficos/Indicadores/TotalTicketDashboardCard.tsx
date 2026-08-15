import { TotalTicketDashboardCardProps, TotalValueDashboardCardProps } from "../../types";
import { DashboardMetric } from "../../../../types/dashboard";
import { CurrencyType } from "../../../../types/commom";

import StringUtil from "../../../../utils/string.util";
import utils from "../../../../utils";
import "./style.css";

export default function TotalTicketDashboardCard(props: {
    ticket: TotalTicketDashboardCardProps;
    somaTotal: TotalValueDashboardCardProps;
}) {
    const textTicketTotal =
        props.ticket.hideValues !== true
            ? utils.retornaValorMonetario(props.ticket.valoTotalAtual, CurrencyType.BRL)
            : "";

    const porcentTicketAtualVsAnterior =
        props.ticket.valorTotalAnterior && props.ticket.valorTotalAnterior !== 0
            ? ((props.ticket.valoTotalAtual - props.ticket.valorTotalAnterior) * 100) / props.ticket.valorTotalAnterior
            : 0;

    const textValorTotal =
        props.somaTotal.hideValues !== true
            ? props.somaTotal.metrica === DashboardMetric.VISITA
                ? props.somaTotal.valoTotalAtual
                : utils.retornaValorMonetario(props.somaTotal.valoTotalAtual, CurrencyType.BRL)
            : "Soma";

    const isPositive = porcentTicketAtualVsAnterior >= 0;
    const showComparison = props.ticket.valorTotalAnterior != null && props.ticket.valorTotalAnterior !== 0;

    return (
        <div className="total-ticket-card position-relative overflow-hidden">
            <div className="d-flex flex-column h-100 justify-content-between position-relative">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <span className="total-ticket-title d-flex flex-column">Ticket Médio</span>

                        <small className="total-ticket-spam">
                            {StringUtil.getDashboardMetricDescription(props.ticket.metrica)}
                        </small>
                    </div>

                    <div className="total-ticket-icon d-flex align-items-center justify-content-center">
                        <i className="bi bi-graph-up" />
                    </div>
                </div>

                <div className="mt-4">
                    <h2 className="total-ticket-value fw-bold">{textTicketTotal}</h2>
                    <div className="total-value mb-2"> {textValorTotal} / Qnt. </div>
                    {showComparison && (
                        <div
                            className={`total-ticket-comparison d-inline-flex align-items-center px-3 py-2 ${
                                isPositive ? "positive" : "negative"
                            }`}
                        >
                            <i className={`bi ${isPositive ? "bi-arrow-up-right" : "bi-arrow-down-right"}`} />
                            <span>{Math.abs(porcentTicketAtualVsAnterior).toFixed(2)}%</span>
                            <span className="total-ticket-period">vs. ano anterior</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
