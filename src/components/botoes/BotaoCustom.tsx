import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import React, { ReactNode, useCallback } from "react";

export interface BotaoCustomProps {
    tooltip?: string;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    children?: ReactNode;
}
export default function BotaoCustom({ onClick, ...props }: BotaoCustomProps) {
    //EVENTOS
    const handleOnClick = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            onClick(event);
        },
        [onClick]
    );

    return (
        <OverlayTrigger
            delay={150}
            flip
            placement="top"
            trigger={["focus", "hover"]}
            overlay={<Tooltip className={props.tooltip ? "" : "d-none"}>{props.tooltip}</Tooltip>}
        >
            <Button
                data-test="custom-icon-btn"
                onClick={handleOnClick}
                className="my-btn-icon bg-transparent border-0 rounded-circle d-flex justify-content-center align-items-center p-0 m-0"
            >
                {props.children}
            </Button>
        </OverlayTrigger>
    );
}
