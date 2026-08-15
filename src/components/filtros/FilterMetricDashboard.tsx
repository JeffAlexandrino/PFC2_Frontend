import { DashboardMetric } from "../../types/dashboard";
import { ListGroup } from "react-bootstrap";

import FiltroSelect from "../../ui/filter/Filter";
import StringUtil from "../../utils/string.util";
import utils from "../../utils";

export interface DropdownMetricaDashboardProps {
    metricaAtual: DashboardMetric;
    setMetricaAtual: React.Dispatch<React.SetStateAction<DashboardMetric>>;
}

export default function DropdownMetricaDashboard({ metricaAtual, setMetricaAtual }: DropdownMetricaDashboardProps) {
    return (
        <FiltroSelect titulo="Métrica Atual:" texto={StringUtil.getDashboardMetricDescription(metricaAtual)}>
            <ListGroup className="small">
                {utils.returnDashboardMetrics().map((metrica) => {
                    return (
                        <ListGroup.Item
                            key={metrica}
                            action
                            onClick={() => setMetricaAtual(metrica)}
                            className={`my-item-filtro ${metricaAtual === metrica ? "bg-light fw-bold text-primary" : ""}`}
                        >
                            {StringUtil.getDashboardMetricDescription(metrica)}
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
        </FiltroSelect>
    );
}
