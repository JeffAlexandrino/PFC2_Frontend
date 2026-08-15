import { Stack } from "react-bootstrap";
import { ReactNode } from "react";

import CardDashboardResumo from "./CardDashboardResumo";

import "./styles.css";

export default function CardDashboard(props: {
    disabledText?: string;
    label: string;
    valor: ReactNode;
    porcent?: { valor: number; miniLabel: string };
    color?: "red" | "orange" | "green" | "blue";
    icon?: string;
    pinned?: boolean;
}) {
    return (
        <CardDashboardResumo.Root className={`my-card-dashboard-${props.color ?? "red"} position-relative`}>
            {props.disabledText ? (
                <Stack className="d-flex w-100 align-items-center h-100 justify-content-center">
                    <i className="bi bi-exclamation-circle fs-4" />
                    <div className="w-100 text-center">{props.disabledText}</div>
                </Stack>
            ) : (
                <>
                    {props.pinned && <i className={"position-absolute end-0 top-0 mt-2 me-2 bi bi-pin-fill fs-5"} />}
                    <CardDashboardResumo.Left>
                        <i className={`bi bi-${props.icon ?? "graph-up-arrow"} display-3 text-dark`} />
                    </CardDashboardResumo.Left>
                    <CardDashboardResumo.Right>
                        <Stack className="text-dark text-nowrap">
                            <h5 className="mb-0">{props.label}</h5>
                            <span className="fs-4">{props.valor}</span>
                            {props.porcent !== undefined && (
                                <span>
                                    <i className={`bi bi-caret-${props.porcent.valor > 0 ? "up" : "down"}-fill`} />{" "}
                                    {isNaN(props.porcent.valor) || !isFinite(props.porcent.valor)
                                        ? "--,--"
                                        : props.porcent.valor.toFixed(2)}
                                    % {props.porcent.miniLabel}
                                </span>
                            )}
                        </Stack>
                    </CardDashboardResumo.Right>
                </>
            )}
        </CardDashboardResumo.Root>
    );
}
