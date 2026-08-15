import useFiltros, { FilterKey } from "../../hooks/useFiltros";
import { ListGroup, Overlay, Stack } from "react-bootstrap";
import { useCallback, useRef, useState } from "react";

import FiltroSelect from "../../ui/filter/Filter";
import Botao from "../botoes/Botao";

export type tPossivelMes = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type tMesesSelecionados = { inicio?: tPossivelMes; fim?: tPossivelMes };

const auxData = new Date(); //gets actual date
export const DEFAULT_INIT_MONTH = auxData.getMonth().toString();
export const DEFAULT_END_MONTH = auxData.getMonth().toString();

export type FiltroMesProps = { notActive?: boolean };
export default function FiltroMes(props: FiltroMesProps) {
    //HOOKS
    const { mesInicialSelecionado, mesFinalSelecionado, setFilter } = useFiltros();

    //ESTADOS
    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
    const [mostrarTrimestres, setMostrarTrimestres] = useState(false);

    const divRef = useRef<HTMLAnchorElement>(null);
    const trimestreRef = useRef<HTMLAnchorElement>(null);

    //VARIAVEIS
    const todosOsMesesSelecionados = mesInicialSelecionado === 0 && mesFinalSelecionado === 11;

    const retornaTextoFiltro = useCallback((): string => {
        if (mesInicialSelecionado === undefined || mesFinalSelecionado === undefined) return "--- undefined ---";

        auxData.setMonth(mesInicialSelecionado); //Gets the initial month possible: 0 = Jan
        const mesInicial = auxData.toLocaleDateString("pt-Br", { month: "short" });

        auxData.setMonth(mesFinalSelecionado); //Gets the final month possible: 11 = Dec
        const mesFinal = auxData.toLocaleDateString("pt-Br", { month: "short" });

        return todosOsMesesSelecionados ? "Todos os meses" : `De ${mesInicial} até ${mesFinal}`;
    }, [mesInicialSelecionado, mesFinalSelecionado, todosOsMesesSelecionados]);

    //EVENTOS
    const handleOnChangeMeses = useCallback(
        (mesesSelecionados: tMesesSelecionados) => {
            //The ? is to handle the undefined possibility
            setFilter(FilterKey.INITIAL_MONTH, mesesSelecionados?.inicio?.toString() ?? "0");
            setFilter(FilterKey.END_MONTH, mesesSelecionados?.fim?.toString() ?? "11");
        },
        [setFilter]
    );

    const handleOnMostrarOpcoes = useCallback(() => setMostrarOpcoes(true), []);
    const handleOnFecharOpcoes = useCallback(() => setMostrarOpcoes(false), []);

    const handleOnMostrarTrimestres = useCallback(() => setMostrarTrimestres(true), []);
    const handleOnFecharTrimestres = useCallback(() => setMostrarTrimestres(false), []);

    const handleOnEscolherTrimestre = useCallback(
        (mesesSelecionados: tMesesSelecionados) => {
            handleOnChangeMeses(mesesSelecionados);
            handleOnFecharTrimestres();
        },
        [handleOnChangeMeses, handleOnFecharTrimestres]
    );

    return (
        <>
            <FiltroSelect
                titulo="Período:"
                texto={retornaTextoFiltro()}
                active={(mesFinalSelecionado !== 11 || mesInicialSelecionado !== 0) && !props.notActive}
                customButtonClass="my-btn-mes-select"
            >
                <ListGroup className="small">
                    <ListGroup.Item
                        className={`my-item-filtro ${todosOsMesesSelecionados ? "bg-light fw-bold text-primary" : ""}`}
                        onClick={() => handleOnChangeMeses({ inicio: 0, fim: 11 })}
                    >
                        Todos os meses
                    </ListGroup.Item>
                    <ListGroup.Item
                        onClick={handleOnMostrarOpcoes}
                        ref={divRef}
                        className="my-item-filtro position-relative"
                    >
                        <div className="d-flex align-items-center w-100">
                            <span>Selecionar meses</span>
                            <i className="bi bi-caret-right-fill position-absolute end-0 me-2 text-info" />
                        </div>
                    </ListGroup.Item>

                    <ListGroup.Item
                        onClick={handleOnMostrarTrimestres}
                        ref={trimestreRef}
                        className="my-item-filtro position-relative"
                    >
                        <div className="d-flex align-items-center w-100">
                            <span>Selecionar trimestre</span>
                            <i className="bi bi-caret-right-fill position-absolute end-0 me-2 text-info" />
                        </div>
                    </ListGroup.Item>
                </ListGroup>
            </FiltroSelect>
            <Overlay
                show={mostrarOpcoes}
                placement="right-end"
                flip
                target={divRef.current}
                rootClose
                onHide={handleOnFecharOpcoes}
            >
                {({
                    placement: _placement,
                    arrowProps: _arrowProps,
                    show: _show,
                    popper: _popper,
                    hasDoneInitialMeasure: _hasDoneInitialMeasure,
                    ...overlayProps
                }) => (
                    <div {...overlayProps}>
                        <FiltroOpcoes setMesesSelecionados={handleOnChangeMeses} onHide={handleOnFecharOpcoes} />
                    </div>
                )}
            </Overlay>

            <Overlay
                show={mostrarTrimestres}
                placement="right-start"
                flip
                target={trimestreRef.current}
                rootClose
                onHide={handleOnFecharTrimestres}
            >
                {({
                    placement: _placement,
                    arrowProps: _arrowProps,
                    show: _show,
                    popper: _popper,
                    hasDoneInitialMeasure: _hasDoneInitialMeasure,
                    ...overlayProps
                }) => (
                    <div {...overlayProps}>
                        <FiltroTrimestreOpcoes onEscolherTrimestre={handleOnEscolherTrimestre} />
                    </div>
                )}
            </Overlay>
        </>
    );
}

function FiltroTrimestreOpcoes({ onEscolherTrimestre }: { onEscolherTrimestre: (valor: tMesesSelecionados) => void }) {
    const trimestres: { label: string; valor: tMesesSelecionados }[] = [
        { label: "Q1: Jan - Mar", valor: { inicio: 0, fim: 2 } },
        { label: "Q2: Abr - Jun", valor: { inicio: 3, fim: 5 } },
        { label: "Q3: Jul - Set", valor: { inicio: 6, fim: 8 } },
        { label: "Q4: Out - Dez", valor: { inicio: 9, fim: 11 } },
    ];

    return (
        <ListGroup
            className="my-filtro-trimestre-opcoes small bg-white ms-3 p-1 rounded shadow"
            onClick={(e) => e.stopPropagation()}
        >
            {trimestres.map((t) => (
                <ListGroup.Item
                    key={t.label}
                    className="my-item-filtro border-0"
                    onClick={() => onEscolherTrimestre(t.valor)}
                >
                    {t.label}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}

function FiltroOpcoes({
    setMesesSelecionados,
    onHide,
}: {
    setMesesSelecionados: (valor: tMesesSelecionados) => void;
    onHide: () => void;
}) {
    //ESTADOS
    const [inicio, setInicio] = useState<tPossivelMes | null>(null);
    const [sobreIndex, setSobreIndex] = useState<number | null>(null);

    //EVENTOS
    const handleOnClickMes = useCallback(
        (e: React.MouseEvent, valor: tPossivelMes) => {
            e.stopPropagation();
            if (inicio === null || valor < inicio) setInicio(valor);
            else {
                setMesesSelecionados({ inicio, fim: valor });
                setInicio(null);
                setSobreIndex(null);
                onHide();
            }
        },
        [inicio, setMesesSelecionados, onHide]
    );

    const handleOnOverMes = useCallback(
        (index: number) => {
            if (inicio !== null) setSobreIndex(index);
        },
        [inicio]
    );

    return (
        <Stack
            className="my-filtro-mes-opcoes d-flex align-items-center gap-2 bg-white ms-3 p-1 rounded shadow"
            onClick={(e) => e.stopPropagation()}
        >
            {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dec"].map((mes, index) => {
                const acharIntervalo = inicio !== null && sobreIndex !== null;
                const botaoNoIntervaloMaior =
                    acharIntervalo && sobreIndex > inicio && index > inicio && index <= sobreIndex;
                return (
                    <Botao
                        className={`my-mes-button d-flex justify-content-center ${
                            index === inicio ? "my-mes-inicio" : botaoNoIntervaloMaior ? "my-mes-interval" : ""
                        }`}
                        key={mes}
                        onClick={(e) => handleOnClickMes(e, index as tPossivelMes)}
                        onMouseOver={() => handleOnOverMes(index)}
                    >
                        {mes}
                    </Botao>
                );
            })}
        </Stack>
    );
}
