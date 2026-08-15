import { useCallback, useState } from "react";
import { Spinner } from "react-bootstrap";

interface Props {
    variant?: string;
    texto: string;
    onClick: () => void | Promise<void>;
}

export default function BotaoLabel({ onClick, ...props }: Props) {
    //ESTADO
    const [processando, setProcessando] = useState(false);

    //EVENTOS
    const handleOnClick = useCallback(async () => {
        try {
            setProcessando(true);
            await onClick();
        } catch (err) {
            console.error(err);
        } finally {
            setProcessando(false);
        }
    }, [onClick]);

    return (
        <span
            role="button"
            className={`text-${props.variant} my-label-botao`}
            title={props.texto}
            onClick={handleOnClick}
        >
            {props.texto} {processando && <Spinner className="ms-1" size="sm" />}
        </span>
    );
}
