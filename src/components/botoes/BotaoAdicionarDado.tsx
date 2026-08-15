import { Button, ButtonGroup, Overlay, Popover } from "react-bootstrap";
import { useCallback, useRef, useState } from "react";

import Botao from "./Botao";

import "./styles.css";

interface IBotaoAdicionarDado {
    texto?: string;
    onClickAdd?: React.MouseEventHandler<HTMLButtonElement>;
    onClickImport?: React.MouseEventHandler<HTMLButtonElement>;
}
export default function BotaoAdicionarDado(props: IBotaoAdicionarDado) {
    //ESTADOS
    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
    const botaoRef = useRef<HTMLDivElement>(null);

    //EVENTOS
    const handleOnShow = useCallback(() => setMostrarOpcoes(true), []);
    const handleOnHide = useCallback(() => setMostrarOpcoes(false), []);

    return (
        <>
            <ButtonGroup ref={botaoRef} data-test="btn-group-add">
                <Button
                    className={props.onClickImport ? "rounded-start-pill" : "rounded-pill"}
                    onClick={props.onClickAdd}
                >
                    <i className="bi bi-plus-lg me-1" /> {props.texto}
                </Button>
                {props.onClickImport && (
                    <Button className="ps-2 pe-2 rounded-end-pill" onClick={handleOnShow}>
                        <span className="small">
                            <i className="bi bi-caret-down-fill small" />
                        </span>
                    </Button>
                )}
            </ButtonGroup>
            <Overlay
                target={botaoRef.current}
                show={mostrarOpcoes}
                placement="bottom-end"
                container={botaoRef.current}
                rootClose
                onHide={handleOnHide}
            >
                <Popover className="p-1 shadow" data-test="btn-group-add-menu">
                    <ButtonGroup vertical>
                        <Botao size="sm" onClick={props.onClickImport}>
                            <span className="text-truncate">
                                <i className="bi bi-file-earmark-spreadsheet me-2" />
                                Importar dados
                            </span>
                        </Botao>
                    </ButtonGroup>
                </Popover>
            </Overlay>
        </>
    );
}
