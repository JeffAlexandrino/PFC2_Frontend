import { ReactNode } from "react";

import "./styles.css";

interface ICardDashboardResumoRootProps {
    children?: ReactNode;
    className?: string;
}

export default function CardDashboardResumoRoot(props: ICardDashboardResumoRootProps) {
    return (
        <div
            className={
                "my-card-dashboard-resumo-root d-flex align-items-center justify-content-start gap-4 rounded-4 p-3 shadow " +
                props?.className
            }
        >
            {props.children}
        </div>
    );
}
