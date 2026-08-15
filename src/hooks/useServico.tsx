import { tNovoServico } from "../components/forms/FormServico";
import api, { tQueryParamsServico } from "../services/api";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";
import { PartialEntity, tServico } from "../interfaces";

import utils from "../utils";

let abortController: AbortController | undefined;
export const LIMITE_POR_BUSCA_SERVICOS = 50;

export default function useServico() {
    //CONTEXTOS
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    //ESTADOS
    const [arrBuscando, setArrBuscando] = useState<true[]>([]);
    const [arrBuscandoPorId, setArrBuscandoPorId] = useState<true[]>([]);
    const [estaCriando, setEstaCriando] = useState(false);
    const [estaDeletando, setEstaDeletando] = useState(false);
    const [estaEditando, setEstaEditando] = useState(false);
    const [buscaComErro, setBuscaComErro] = useState(false);

    const buscar = useCallback(
        async (params?: tQueryParamsServico): Promise<tServico[]> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<tServico[]>(async (resolve, reject) => {
                try {
                    setArrBuscando((current) => [...current, true]);
                    const res = await api.findServices(params, signal);
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
        },
        [setPerigo]
    );

    const buscarPorId = useCallback(
        async (id: string): Promise<tServico> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<tServico>(async (resolve, reject) => {
                try {
                    setArrBuscandoPorId((current) => [...current, true]);
                    const res = await api.getService(id, signal);
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
        async (servicos: tNovoServico[]): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<void>(async (resolve, reject) => {
                try {
                    setEstaCriando(true);
                    await api.createService(servicos, signal);
                    setSucesso(servicos.length > 1 ? "Serviços adicionados!" : "Serviço adicionado!");
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
        async (servico: tNovoServico & PartialEntity<tServico, "id">): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<void>(async (resolve, reject) => {
                try {
                    setEstaEditando(true);
                    await api.updateService(servico, signal);
                    setSucesso("Serviço editado!");
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
                    await api.deleteService(id, signal);
                    setSucesso("Serviço deletado!");
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
