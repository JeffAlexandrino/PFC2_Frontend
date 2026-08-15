import { Button, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import React, { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../../contexts/ContextAlert";

interface Props {
    tooltip?: string;
    onClick: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
}
export default function BotaoDeletar(props: Props) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //ESTADOS
    const [carregando, setCarregando] = useState(false);

    //VARIAVEIS
    const { onClick } = props;

    //EVENTOS
    const handleOnClick = useCallback(
        async (event: React.MouseEvent<HTMLElement>) => {
            try {
                setCarregando(true);
                await onClick(event);
            } catch (err) {
                console.error(err);
                setPerigo("Erro ao deletar, tente novamente mais tarde.");
            } finally {
                setCarregando(false);
            }
        },
        [setPerigo, onClick]
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
                data-test="delete-icon-btn"
                onClick={handleOnClick}
                className="my-btn-icon bg-transparent border-0 rounded-circle d-flex justify-content-center align-items-center p-0 m-0"
            >
                {carregando ? (
                    <Spinner size="sm" variant="danger" />
                ) : (
                    <i className="bi bi-trash text-danger opacity-75" />
                )}
            </Button>
        </OverlayTrigger>
    );
}
