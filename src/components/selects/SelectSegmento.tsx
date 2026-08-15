import { useCallback, useContext, useEffect, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { tSegmento } from "../../interfaces";

import OffcanvasSegmento from "../offcanvas/OffcanvasSegmento";
import useSegmento from "../../hooks/useSegmento";
import SelectMenu from "./SelectMenu";

export interface ISelectSegmentoProps {
    idSelecionado?: string | null;
    setIdSelecionado?: (id: string | null) => void;
}

export default function SelectSegmento({ idSelecionado, setIdSelecionado }: ISelectSegmentoProps) {
    //HOOKS
    const { buscar, estaBuscando, cancelar, buscaComErro } = useSegmento();

    //CONTEXTOS
    const { canEditSegment, canDeleteSegment, canAddSegment } = useContext(ContextUser);

    //ESTADOS
    const [segmentos, setSegmentos] = useState<tSegmento[]>([]);
    const [pesquisa, setPesquisa] = useState("");

    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);
    const [segmentoEditando, setSegmentoEditando] = useState<tSegmento | null>(null);
    const [segmentoDeletando, setSegmentoDeletando] = useState<tSegmento | null>(null);

    //VARIAVEIS
    const segmentosFiltrados = segmentos.filter((segmento) =>
        segmento.name.toLowerCase().includes(pesquisa.toLowerCase())
    );

    const valoresFormatados = segmentosFiltrados.map((segmento) => ({
        ...segmento,
        texto: segmento.name,
        selecionado: idSelecionado === segmento.id,
    }));

    //EVENTOS
    const buscarSegmentos = useCallback(() => {
        buscar()
            .then((segmentos) => setSegmentos(segmentos))
            .catch((err) => console.error(err));
    }, [buscar]);

    useEffect(() => {
        buscarSegmentos();
        return () => cancelar();
    }, [cancelar, buscarSegmentos]);

    const handleOnClickAdicionar = useCallback(() => setMostrarAdicionar(true), []);

    const handleOnClickEditar = useCallback(
        (id: string) => {
            const segmentoEditando = segmentos.find((segmento) => segmento.id === id);
            if (segmentoEditando) setSegmentoEditando(segmentoEditando);
        },
        [segmentos]
    );
    const handleOnClickDeletar = useCallback(
        (id: string) => {
            const segmentoDeletando = segmentos.find((segmento) => segmento.id === id);
            if (segmentoDeletando) setSegmentoDeletando(segmentoDeletando);
        },
        [segmentos]
    );
    const handleOnClickSegmento = useCallback(
        (id: string) => {
            if (!setIdSelecionado) return;

            //Encontrando o novo segmento a selecionar
            const segmentoNovo = segmentos.find((segmento) => segmento.id === id);
            if (!segmentoNovo) return;

            if (segmentoNovo.id === idSelecionado) return setIdSelecionado(null);
            setIdSelecionado(segmentoNovo.id);
        },
        [setIdSelecionado, segmentos, idSelecionado]
    );

    const returnLabelSegmentoSelecionado = useCallback((): string => {
        if (!idSelecionado) return "--- Nenhum ---";

        const segmentoSelecionado = segmentos.find(({ id }) => id === idSelecionado);
        if (!segmentoSelecionado) return "--- Nenhum ---";
        return segmentoSelecionado.name;
    }, [idSelecionado, segmentos]);

    return (
        <>
            <SelectMenu
                setPesquisa={setPesquisa}
                valores={valoresFormatados}
                texto={returnLabelSegmentoSelecionado()}
                onOpenMenu={buscaComErro ? buscarSegmentos : undefined}
                onClickAdicionar={canAddSegment({}) ? handleOnClickAdicionar : undefined}
                onClickItem={handleOnClickSegmento}
                onClickDeletar={canDeleteSegment({}) ? handleOnClickDeletar : undefined}
                onClickEditar={canEditSegment({}) ? handleOnClickEditar : undefined}
                closeOnSelect
                carregando={estaBuscando}
            />

            <OffcanvasSegmento
                tipo="criar"
                mostrarForm={mostrarAdicionar}
                onCancel={() => setMostrarAdicionar(false)}
                onTerminou={buscarSegmentos}
            />

            <OffcanvasSegmento
                tipo="editar"
                mostrarForm={segmentoEditando !== null}
                onCancel={() => setSegmentoEditando(null)}
                onTerminou={() => {
                    setSegmentoEditando(null);
                    buscarSegmentos();
                }}
                dados={segmentoEditando}
            />

            <OffcanvasSegmento
                tipo="deletar"
                mostrarForm={segmentoDeletando !== null}
                onCancel={() => setSegmentoDeletando(null)}
                onTerminou={() => {
                    setSegmentoDeletando(null);
                    buscarSegmentos();
                }}
                dados={segmentoDeletando}
            />
        </>
    );
}
