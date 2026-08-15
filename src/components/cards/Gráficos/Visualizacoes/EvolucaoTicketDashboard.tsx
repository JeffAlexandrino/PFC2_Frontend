import { DashboardMetric } from "../../../../types/dashboard";
import { EvolucaoTicketDashboardProps } from "../../types";

import StringUtil from "../../../../utils/string.util";
import EvolucaoDashboard from "./EvolucaoDashboard";

export default function EvolucaoTicketDashboard(props: EvolucaoTicketDashboardProps) {
    return (
        <EvolucaoDashboard
            monetario={props.metrica !== DashboardMetric.VISITA}
            disabledText={
                props.metrica === DashboardMetric.VISITA
                    ? `'${StringUtil.getDashboardMetricDescription(
                          DashboardMetric.VISITA
                      )}' não é uma métrica válida para este card`
                    : undefined
            }
            title={"Evolução de Ticket Médio - " + StringUtil.getDashboardMetricDescription(props.metrica) + ""}
            dados={{
                anoAtual: props.anoAtual.map(({ valorTicketMedio, mesAno }) => ({
                    valor: valorTicketMedio,
                    mesAno,
                })),
                anoAnterior: props.anoAnterior.map(({ valorTicketMedio, mesAno }) => ({
                    valor: valorTicketMedio,
                    mesAno,
                })),
            }}
        />
    );
}
