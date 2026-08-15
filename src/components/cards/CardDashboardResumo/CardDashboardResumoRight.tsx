import { ReactNode } from "react";

import "./styles.css";

interface ICardDashboardResumorightProps {
    children?: ReactNode;
}

export default function CardDashboardResumoRight(props: ICardDashboardResumorightProps) {
    return <div className="my-card-dashboard-resumo-right d-flex">{props.children}</div>;
}
