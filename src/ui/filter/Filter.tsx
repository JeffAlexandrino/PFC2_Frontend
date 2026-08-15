import { Col, Overlay, Placeholder, Row, Spinner } from "react-bootstrap";
import { ReactNode, useCallback, useRef, useState } from "react";

import InputSearch from "../../components/inputs/InputSearch";

import "./styles.css";

interface FiltroSelectProps {
    titulo?: string;
    texto?: string;
    onSearch?: (pesquisa?: string) => void;
    children?: ReactNode;
    onOpen?: () => void;
    onClose?: () => void;
    carregando?: boolean;
    active?: boolean;
    disabled?: boolean;
    customButtonClass?: string;
}

export default function FiltroSelect(props: FiltroSelectProps) {
    //ESTADOS
    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
    const [pesquisa, setPesquisa] = useState<string | undefined>(undefined);
    const filtroButtonRef = useRef<HTMLButtonElement>(null);

    //VARIAVEIS
    const { onSearch, onOpen, onClose } = props;

    //EVENTOS
    const handleOnChangeText = useCallback(
        (pesquisa?: string) => {
            if (onSearch) onSearch(pesquisa);
            setPesquisa(pesquisa);
        },
        [onSearch]
    );
    const handleOnShow = useCallback(() => {
        setMostrarOpcoes(true);
        if (onOpen) onOpen();
    }, [onOpen]);
    const handleOnHide = useCallback(() => {
        setMostrarOpcoes(false);
        if (onClose) onClose();
    }, [onClose]);

    return (
        <>
            <button
                disabled={props.disabled}
                data-test="filter-btn"
                className={`my-btn-filter-select d-flex border rounded-pill bg-white ps-2 pe-2 position-relative align-items-center ${props.customButtonClass || ""}`}
                title={props.texto}
                onClick={handleOnShow}
                ref={filtroButtonRef}
            >
                <div
                    className={`my-div-filter-text position-relative d-flex justify-content-between align-items-center w-100 ${
                        !props.active && "text-secondary-dark"
                    }`}
                >
                    {props.carregando ? (
                        <Placeholder
                            className="d-flex align-items-center w-100 h-100 text-center opacity-25"
                            animation="glow"
                        >
                            <Placeholder sm="10" className="rounded-1" />
                        </Placeholder>
                    ) : (
                        <span className="text-truncate me-3">
                            {props.titulo ? (
                                <span
                                    className={`me-2 rounded-pill p-1 ${
                                        props.active ? "text-primary" : "text-secondary-dark"
                                    }`}
                                >
                                    <i className="me-1 bi bi-filter-circle-fill" />
                                    <span className="fw-bold">{props.titulo}</span>
                                </span>
                            ) : (
                                <i className={`me-1 bi bi-filter-circle-fill`} />
                            )}

                            {props.texto}
                        </span>
                    )}

                    <i className="bi bi-caret-down-fill small opacity-75" />
                </div>
            </button>
            <Overlay
                target={filtroButtonRef.current}
                show={mostrarOpcoes}
                placement="bottom-start"
                container={filtroButtonRef.current}
                rootClose
                onHide={handleOnHide}
            >
                {({
                    placement: _placement,
                    arrowProps: _arrowProps,
                    show: _show,
                    popper: _popper,
                    hasDoneInitialMeasure: _hasDoneInitialMeasure,
                    ...overlayProps
                }) => (
                    <div
                        data-test="filter-menu"
                        className="mt-1 bg-white rounded shadow p-2"
                        {...overlayProps}
                        style={{ minWidth: "100%", ...overlayProps.style }}
                    >
                        <Row>
                            {props.onSearch && (
                                <Col sm="12" className="mb-2">
                                    <InputSearch pesquisa={pesquisa} onChange={handleOnChangeText} />
                                </Col>
                            )}

                            <Col sm="12" className="my-col-filtro-menu-body">
                                {props.carregando ? (
                                    <div className="w-100 text-center">
                                        <Spinner size="sm" /> Carregando...
                                    </div>
                                ) : (
                                    props.children
                                )}
                            </Col>
                        </Row>
                    </div>
                )}
            </Overlay>
        </>
    );
}
