import { ReactNode, useCallback, useRef } from "react";
import { Spinner, Stack } from "react-bootstrap";

export interface InfiniteScrollProps {
    children?: ReactNode;
    buscar?: (page: number) => Promise<number>;
    buscando?: boolean;
    paginaAtual: number;
    proximaPagina: number;
    setPaginaAtual: React.Dispatch<React.SetStateAction<number>>;
    setProximaPagina: React.Dispatch<React.SetStateAction<number>>;
}

export default function InfiniteScroll({
    buscar,
    setPaginaAtual,
    setProximaPagina,
    proximaPagina,
    paginaAtual,
    ...props
}: InfiniteScrollProps) {
    //HOOKS
    const scrollDiv = useRef<HTMLDivElement>(null);

    //EVENTOS
    const handleOnScroll = useCallback(
        async ({ paginaAtual, proximaPagina }: { paginaAtual: number; proximaPagina: number }) => {
            if (!scrollDiv.current || !buscar || proximaPagina <= paginaAtual) return;
            const { scrollTop, scrollHeight, clientHeight } = scrollDiv.current;
            if (scrollTop + clientHeight < scrollHeight - 10 || scrollTop === 0) return;

            try {
                const lengthDados = await buscar(proximaPagina);
                if (lengthDados < 1) return setPaginaAtual((current) => (current += 1));
                setProximaPagina((current) => (current += 1));
                setPaginaAtual((current) => (current += 1));
            } catch (err) {
                console.error(err);
            }
        },
        [scrollDiv, buscar, setPaginaAtual, setProximaPagina]
    );

    return (
        <Stack
            ref={scrollDiv}
            className="d-flex h-100 w-100 overflow-auto ps-2 pe-2"
            onScroll={() => handleOnScroll({ proximaPagina, paginaAtual })}
        >
            {props.children}
            <Stack
                className={`d-flex w-100 text-info align-items-center mb-3 sticky-bottom ${
                    props.buscando ? "opacity-1" : "opacity-0"
                }`}
            >
                <Spinner size="sm" />
                <span className="my-fade-animation">Carregando...</span>
            </Stack>
        </Stack>
    );
}
