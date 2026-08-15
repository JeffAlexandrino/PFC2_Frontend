import { ContextAlerta, IAlerta } from "../../contexts/ContextAlert";
import { useCallback, useContext, useState } from "react";
import { ProgressBar, Toast } from "react-bootstrap";

import BotaoFechar from "../botoes/BotaoFechar";

import "./styles.css";

//Modificar o tempo da animação em ./styles.css caso modifique este valor.
const DELAY_ALERT = 2000;

export default function Alerta() {
    //CONTEXTOS
    const { alertas } = useContext(ContextAlerta);

    //ESTADOS
    const [mouseSobreAlerta, setMouseSobreAlerta] = useState(false);

    //EVENTOS
    const handleOnMouseOver = useCallback(() => {
        setMouseSobreAlerta(true);
    }, []);
    const handleOnMouseDown = useCallback(() => setMouseSobreAlerta(false), []);

    const handleOnAutomaticCloseAlerta = useCallback(
        (alerta: IAlerta) => {
            if (!mouseSobreAlerta) {
                alerta.onClose();
                setMouseSobreAlerta(false);
            }
        },
        [mouseSobreAlerta]
    );

    const handleOnCloseAlerta = useCallback((alerta: IAlerta) => {
        alerta.onClose();
        setMouseSobreAlerta(false);
    }, []);

    return (
        <div aria-live="polite" aria-atomic="true" className="my-div-alerta position-relative">
            {alertas.map((alerta, index) => {
                return (
                    <Toast
                        key={alerta.id}
                        delay={DELAY_ALERT}
                        show={index === alertas.length - 1}
                        autohide
                        onClose={() => handleOnAutomaticCloseAlerta(alerta)}
                        onMouseOver={handleOnMouseOver}
                        onMouseLeave={handleOnMouseDown}
                        className={`my-toast-alerta bg-${alerta.variant} position-absolute end-0 m-3`}
                    >
                        <Toast.Header closeButton={false} className="my-toast-alerta-header">
                            <strong className="me-auto">Alerta</strong>
                            <small className="text-muted me-2">
                                {alerta.date.toLocaleTimeString("pt-Br", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })}
                            </small>
                            <BotaoFechar darkTheme onClick={() => handleOnCloseAlerta(alerta)} />
                        </Toast.Header>
                        <Toast.Body className="my-toast-alerta-body">{alerta.msg}</Toast.Body>
                        <div className="my-alert-div-progress d-flex align-items-end w-100 overflow-hidden rounded-bottom">
                            <div className="my-alert-progress-back d-flex bg-white w-100">
                                <ProgressBar
                                    variant={alerta.variant}
                                    animated
                                    className="my-alert-progress"
                                    now={100}
                                />
                            </div>
                        </div>
                    </Toast>
                );
            })}
        </div>
    );
}
