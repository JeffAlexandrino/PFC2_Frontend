import { Button, Spinner } from "react-bootstrap";
import { useCallback, useState } from "react";

import "./styles.css";

export interface IBotaoAssincronoProps {
    className?: string;
    children?: JSX.Element | string;
    form?: string;
    type?: "button" | "submit" | "reset";
    size?: "sm" | "lg";
    carregando?: boolean;
    variante?: string;
    disabled?: boolean;
    onClick?: () => Promise<void> | void;
}
export const CLASS_NAME_LOADING_BUTTON = "my-loading";

export default function BotaoAssincrono(props: IBotaoAssincronoProps) {
    //ESTADOS
    const [processando, setProcessando] = useState(false);

    //VARIAVEIS
    const { onClick, carregando } = props;

    //EVENTOS
    const handleOnClick = useCallback(async () => {
        if (processando || carregando) return;
        if (!onClick) return;

        setProcessando(true);
        try {
            await onClick();
        } catch (err) {
            console.error(err);
        } finally {
            setProcessando(false);
        }
    }, [onClick, carregando, processando]);

    return (
        <Button
            className={`my-button-async position-relative ${props.className} ${
                !!props.carregando || processando ? CLASS_NAME_LOADING_BUTTON : ""
            }`}
            form={props.form}
            type={props.type}
            size={props.size}
            onClick={!props.disabled ? handleOnClick : undefined}
            variant={props.variante}
            disabled={props.disabled}
        >
            <div className="my-spinner-loading position-absolute w-100 h-100 top-0 start-0 p-2 justify-content-center align-items-center d-none">
                <Spinner size="sm" />
            </div>
            <div className="my-button-async-children d-flex h-100 w-100 justify-content-center">{props.children}</div>
        </Button>
    );
}
