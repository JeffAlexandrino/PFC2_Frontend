import { Button, Col, Container, ListGroup, Overlay, OverlayTrigger, Placeholder, Row, Tooltip } from "react-bootstrap";
import { ReactNode, useCallback, useRef, useState } from "react";

import BotaoDeletar from "../botoes/BotaoDeletar";
import BotaoEditar from "../botoes/BotaoEditar";
import InputSearch from "../inputs/InputSearch";

import "./styles.css";

interface IValor {
    id: string;
    selecionado: boolean;
    texto: ReactNode;
}

export interface ISelectMenuProps {
    texto?: string;
    setPesquisa?: (pesquisa: string) => void;
    valores: IValor[];
    onOpenMenu?: () => void;
    onClickItem?: (id: string) => void;
    onClickAdicionar?: () => void;
    onClickEditar?: (id: string) => void;
    onClickDeletar?: (id: string) => void;
    disabled?: boolean;
    size?: "sm";
    closeOnSelect?: boolean;
    carregando?: boolean;
    placeholder?: string;
}

export default function SelectMenu(props: ISelectMenuProps) {
    //ESTADOS
    const [pesquisaInterna, setPesquisaInterna] = useState("");
    const [mostraMenuSelecao, setMostraMenuSelecao] = useState(false);
    const [idValorOver, setIdValorOver] = useState<string | null>(null);

    const refButton = useRef<HTMLButtonElement>(null);

    //VARIAVEIS
    const divRef = useRef<HTMLDivElement>(null);
    const { setPesquisa, onClickItem, onClickDeletar, onClickEditar, onClickAdicionar, closeOnSelect, onOpenMenu } =
        props;

    //EVENTOS
    const handleOnClickSpan = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setMostraMenuSelecao(true);
            if (onOpenMenu) onOpenMenu();
        },
        [onOpenMenu]
    );

    const handleOnHideMenuSelecao = useCallback(() => setMostraMenuSelecao(false), []);

    const handleOnPesquisa = useCallback(
        (pesquisa?: string) => {
            setPesquisaInterna(pesquisa ?? "");
            if (setPesquisa) setPesquisa(pesquisa ?? "");
        },
        [setPesquisa]
    );

    const handleOnClickAdicionar = useCallback(() => {
        if (onClickAdicionar) onClickAdicionar();
        setMostraMenuSelecao(false);
    }, [onClickAdicionar]);

    const handleClickItem = useCallback(
        (id: string) => {
            if (onClickItem) onClickItem(id);
            if (closeOnSelect) setMostraMenuSelecao(false);
        },
        [onClickItem, closeOnSelect]
    );
    const handleOnEditItem = useCallback(
        (id: string, event: React.MouseEvent) => {
            event.stopPropagation();
            if (onClickEditar) onClickEditar(id);
            setMostraMenuSelecao(false);
        },
        [onClickEditar]
    );
    const handleOnDeleteItem = useCallback(
        (id: string, event: React.MouseEvent) => {
            event.stopPropagation();
            if (onClickDeletar) onClickDeletar(id);
            setMostraMenuSelecao(false);
        },
        [onClickDeletar]
    );

    const handleOnOverValor = useCallback((id: string) => setIdValorOver(id), []);
    const handleOnOutValor = useCallback(() => setIdValorOver(null), []);

    return (
        <>
            <div className="w-100 overflow-hidden" ref={divRef}>
                <OverlayTrigger
                    placement="top"
                    flip
                    delay={200}
                    overlay={<Tooltip className={props.disabled ? "d-none" : ""}>Clique para selecionar</Tooltip>}
                >
                    <button
                        data-test="select-btn"
                        ref={refButton}
                        className={`my-select-menu-button d-inline-block text-truncate ${
                            props.disabled ? "text-secondary" : "text-info"
                        } ${props.size === "sm" ? "small" : ""}`}
                        role={props.disabled ? "" : "button"}
                        onClick={props.disabled ? undefined : handleOnClickSpan}
                    >
                        {props.carregando ? (
                            <Placeholder animation="glow" className="opacity-25 w-100">
                                <Placeholder sm="12" className="rounded" size="sm" />
                            </Placeholder>
                        ) : (
                            <span>
                                {props.texto} <i className="bi bi-caret-down-fill ms-2" />
                            </span>
                        )}
                    </button>
                </OverlayTrigger>
            </div>

            <Overlay
                show={mostraMenuSelecao}
                target={refButton}
                container={divRef}
                flip
                placement={"bottom-end"}
                rootClose
                onHide={handleOnHideMenuSelecao}
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
                        data-test="select-menu"
                        className="my-select-menu mt-1 bg-white rounded shadow p-2 text-start"
                        {...overlayProps}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Row>
                            <Col sm="12" className="mb-2">
                                <InputSearch
                                    placeholder={props.placeholder ?? "Pesquisar"}
                                    pesquisa={pesquisaInterna}
                                    onChange={handleOnPesquisa}
                                />
                            </Col>

                            {props.valores?.length < 1 && (
                                <Col sm="12" className="text-center text-secondary-dark">
                                    <small>Nenhum registro encontrado</small>
                                </Col>
                            )}

                            <Col sm="12">
                                <Container fluid className="my-select-menu-col-body">
                                    <ListGroup>
                                        {props.valores.map((valor) => (
                                            <ListGroup.Item
                                                data-test="select-menu-item"
                                                key={valor.id}
                                                role="button"
                                                onClick={() => handleClickItem(valor.id)}
                                                className={`my-select-menu-item-list p-0 small position-relative  ${
                                                    valor.selecionado ? "text-primary" : ""
                                                }`}
                                                onMouseOver={() => handleOnOverValor(valor.id)}
                                                onMouseOut={handleOnOutValor}
                                            >
                                                <div className="p-1 ps-2 text-truncate">{valor.texto}</div>

                                                {idValorOver === valor.id && (onClickEditar || onClickDeletar) && (
                                                    <div className="position-absolute h-100 end-0 top-0 d-flex align-items-center bg-white rounded">
                                                        {onClickEditar && (
                                                            <BotaoEditar
                                                                onClick={(e) => handleOnEditItem(valor.id, e)}
                                                            />
                                                        )}
                                                        {onClickDeletar && (
                                                            <BotaoDeletar
                                                                onClick={(e) => handleOnDeleteItem(valor.id, e)}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Container>
                            </Col>
                            {onClickAdicionar && (
                                <Col sm="12" className="mt-2">
                                    <Button
                                        className="rounded-pill float-end"
                                        size="sm"
                                        onClick={handleOnClickAdicionar}
                                    >
                                        Adicionar
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    </div>
                )}
            </Overlay>
        </>
    );
}
