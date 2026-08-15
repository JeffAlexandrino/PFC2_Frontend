import { tNovoSegmento } from "../components/forms/FormSegmento";
import { useCallback, useContext, useState } from "react";
import { PartialEntity, tSegmento } from "../interfaces";
import { ContextAlerta } from "../contexts/ContextAlert";

import api from "../services/api";
import utils from "../utils";

let abortController: AbortController | undefined;
export const LIMITE_POR_BUSCA_SEGMENTO = 50;

export default function useSegmento() {
    //CONTEXTOS
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    //ESTADOS
    const [arrBuscando, setArrBuscando] = useState<true[]>([]);
    const [arrBuscandoPorId, setArrBuscandoPorId] = useState<true[]>([]);
    const [estaCriando, setEstaCriando] = useState(false);
    const [estaDeletando, setEstaDeletando] = useState(false);
    const [estaEditando, setEstaEditando] = useState(false);
    const [buscaComErro, setBuscaComErro] = useState(false);

    const buscar = useCallback(async (): Promise<tSegmento[]> => {
        abortController = new AbortController();
        const signal = abortController.signal;

        return new Promise<tSegmento[]>(async (resolve, reject) => {
            try {
                setArrBuscando((current) => [...current, true]);
                const res = await api.findSegments(signal);
                setBuscaComErro(false);
                resolve(res.data);
            } catch (err) {
                if (utils.blErroCancelamento(err)) return;
                setPerigo(utils.retornaMensagemErro(err));
                setBuscaComErro(true);
                reject(err);
            } finally {
                setArrBuscando((current) => current.slice(1));
            }
        });
    }, [setPerigo]);

    const buscarPorId = useCallback(
        async (id: string): Promise<tSegmento> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<tSegmento>(async (resolve, reject) => {
                try {
                    setArrBuscandoPorId((current) => [...current, true]);
                    const res = await api.getSegment(id, signal);
                    setBuscaComErro(false);
                    resolve(res.data);
                } catch (err) {
                    if (utils.blErroCancelamento(err)) return;
                    setPerigo(utils.retornaMensagemErro(err));
                    setBuscaComErro(true);
                    reject(err);
                } finally {
                    setArrBuscandoPorId((current) => current.slice(1));
                }
            });
        },
        [setPerigo]
    );

    const criar = useCallback(
        async (segmentos: tNovoSegmento[]): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<void>(async (resolve, reject) => {
                try {
                    setEstaCriando(true);
                    await api.createSegment(segmentos, signal);
                    setSucesso(segmentos.length > 1 ? "Segmentos adicionados!" : "Segmento adicionado!");
                    resolve();
                } catch (err) {
                    if (utils.blErroCancelamento(err)) return;
                    setPerigo(utils.retornaMensagemErro(err));
                    reject(err);
                } finally {
                    setEstaCriando(false);
                }
            });
        },
        [setPerigo, setSucesso]
    );

    const editar = useCallback(
        async (segmento: tNovoSegmento & PartialEntity<tSegmento, "id">): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<void>(async (resolve, reject) => {
                try {
                    setEstaEditando(true);
                    await api.updateSegment(segmento, signal);
                    setSucesso("Segmento editado!");
                    resolve();
                } catch (err) {
                    if (utils.blErroCancelamento(err)) return;
                    setPerigo(utils.retornaMensagemErro(err));
                    reject(err);
                } finally {
                    setEstaEditando(false);
                }
            });
        },
        [setPerigo, setSucesso]
    );

    const deletar = useCallback(
        async (id: string): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<void>(async (resolve, reject) => {
                try {
                    setEstaDeletando(true);
                    await api.deleteSegment(id, signal);
                    setSucesso("Segmento deletado!");
                    resolve();
                } catch (err) {
                    if (utils.blErroCancelamento(err)) return;
                    setPerigo(utils.retornaMensagemErro(err));
                    reject(err);
                } finally {
                    setEstaDeletando(false);
                }
            });
        },
        [setPerigo, setSucesso]
    );

    const cancelar = useCallback(() => abortController?.abort(), []);

    return {
        estaBuscando: arrBuscando.length > 0,
        estaBuscandoPorId: arrBuscandoPorId.length > 0,
        estaCriando,
        estaDeletando,
        estaEditando,
        buscaComErro,
        buscar,
        buscarPorId,
        criar,
        editar,
        deletar,
        cancelar,
    };
}
