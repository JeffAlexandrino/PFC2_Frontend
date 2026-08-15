import { Button } from "react-bootstrap";

import React from "react";

interface Props {
    darkTheme?: boolean;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}
export default function BotaoFechar(props: Props) {
    return (
        <Button
            data-test="close-btn"
            onClick={props.onClick}
            className={`my-btn-icon bg-${
                props.darkTheme ? "secondary" : "white"
            } bg-opacity-25 border-0 rounded-circle d-flex justify-content-center align-items-center p-0 m-0`}
        >
            <i className={`bi bi-x fs-4 text-dark opacity-75`} />
        </Button>
    );
}
