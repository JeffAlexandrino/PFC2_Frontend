/*
import { DashboardMetric } from "../../types/dashboard";
import StringUtil from "../../utils/string.util";
import CardDashboard from "./CardDashboard";
import { MargemDashboardCardProps } from "./types";

export default function MargemDashboardCard(props: MargemDashboardCardProps) {
    const porcentMargemContribuicaoAtualVsAnterior =
        ((props.margemContribuicaoAtual - props.margemContribuicaoAnterior) * 100) / props.margemContribuicaoAnterior;

    return (
        <CardDashboard
            disabledText={
                props.metrica !== DashboardMetric.MARGEM
                    ? `Selecione a métrica '${StringUtil.getDashboardMetricDescription(
                          DashboardMetric.MARGEM
                      )}' para ver este card.`
                    : undefined
            }
            label={"Margem de Contribuição"}
            valor={`${props.margemContribuicaoAtual.toFixed(2)}%`}
            icon="bar-chart-line"
            color="blue"
            porcent={{
                valor: porcentMargemContribuicaoAtualVsAnterior,
                miniLabel: "vs. ano anterior",
            }}
        />
    );
}
*/
