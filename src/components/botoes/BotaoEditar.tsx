import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

import React from "react";

interface Props {
    tooltip?: string;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}
export default function BotaoEditar(props: Props) {
    return (
        <OverlayTrigger
            delay={150}
            flip
            placement="top"
            trigger={["focus", "hover"]}
            overlay={<Tooltip className={props.tooltip ? "" : "d-none"}>{props.tooltip}</Tooltip>}
        >
            <Button
                data-test="edit-icon-btn"
                onClick={props.onClick}
                className="my-btn-icon bg-transparent border-0 rounded-circle d-flex justify-content-center align-items-center p-0 m-0"
            >
                <i className="bi bi-pencil-square text-dark opacity-75" />
            </Button>
        </OverlayTrigger>
    );
}
