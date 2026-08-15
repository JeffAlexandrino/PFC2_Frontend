import { DashboardMetric } from "../../../../types/dashboard";
import { EvolucaoTotalDashboardProps } from "../../types";

import StringUtil from "../../../../utils/string.util";
import EvolucaoDashboard from "./EvolucaoDashboard";

export default function EvolucaoTotalDashboard(props: EvolucaoTotalDashboardProps) {
    return (
        <EvolucaoDashboard
            currentColor="blue"
            monetario={props.metrica !== DashboardMetric.VISITA}
            title={"Evolução de " + StringUtil.getDashboardMetricDescription(props.metrica)}
            dados={{
                anoAtual: props.anoAtual.map(({ valor, mesAno }) => ({
                    valor,
                    mesAno,
                })),
                anoAnterior: props.anoAnterior.map(({ valor, mesAno }) => ({
                    valor,
                    mesAno,
                })),
            }}
        />
    );
}
