import { Button } from "react-bootstrap";

import React from "react";

interface Props {
    darkTheme?: boolean;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    title?: string;
}
export default function BotaoVoltar(props: Props) {
    return (
        <Button
            title={props.title}
            onClick={props.onClick}
            className={`my-btn-icon bg-transparent border-0 rounded-circle d-flex justify-content-center align-items-center p-0 m-0`}
        >
            <i className={`bi bi-arrow-left-circle-fill fs-4 text-dark opacity-75`} />
        </Button>
    );
}
