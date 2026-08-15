import { tNovoTipoProdutoServico } from "../components/forms/FormTipoProdutoServico";
import { PartialEntity, tTipoProdutoServico } from "../interfaces";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import api from "../services/api";
import utils from "../utils";

let abortController: AbortController | undefined;
export const LIMITE_POR_BUSCA_TIPOS_PROD_SERV = 50;

export default function useTipoProdutoServico() {
    //CONTEXTOS
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    //ESTADOS
    const [arrBuscando, setArrBuscando] = useState<true[]>([]);
    const [arrBuscandoPorId, setArrBuscandoPorId] = useState<true[]>([]);
    const [estaCriando, setEstaCriando] = useState(false);
    const [estaDeletando, setEstaDeletando] = useState(false);
    const [estaEditando, setEstaEditando] = useState(false);
    const [buscaComErro, setBuscaComErro] = useState(false);

    const buscar = useCallback(async (): Promise<tTipoProdutoServico[]> => {
        abortController = new AbortController();
        const signal = abortController.signal;

        return new Promise<tTipoProdutoServico[]>(async (resolve, reject) => {
            try {
                setArrBuscando((current) => [...current, true]);
                const res = await api.findTypesProdServ(signal);
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
        async (id: string): Promise<tTipoProdutoServico> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<tTipoProdutoServico>(async (resolve, reject) => {
                try {
                    setArrBuscandoPorId((current) => [...current, true]);
                    const res = await api.getTypeProdServ(id, signal);
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
        async (tipos: tNovoTipoProdutoServico[]): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<void>(async (resolve, reject) => {
                try {
                    setEstaCriando(true);
                    await api.createTypeProdServ(tipos, signal);
                    setSucesso(tipos.length > 1 ? "Tipos adicionados!" : "Tipo adicionado!");
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
        async (tipo: tNovoTipoProdutoServico & PartialEntity<tTipoProdutoServico, "id">): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<void>(async (resolve, reject) => {
                try {
                    setEstaEditando(true);
                    await api.updateTypeProdServ(tipo, signal);
                    setSucesso("Tipo editado!");
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
                    await api.deleteTypeProdServ(id, signal);
                    setSucesso("Tipo deletado!");
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
