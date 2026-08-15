import { ReactNode } from "react";

import "./styles.css";

interface ICardDashboardResumoLeftProps {
    children?: ReactNode;
}

export default function CardDashboardResumoLeft(props: ICardDashboardResumoLeftProps) {
    return <div className="my-card-dashboard-resumo-left d-flex">{props.children}</div>;
}
