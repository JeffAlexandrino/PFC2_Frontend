import { tNovoContrato } from "../components/forms/FormContrato";
import api, { tQueryParamsContrato } from "../services/api";
import { useCallback, useContext, useState } from "react";
import { PartialEntity, tContrato } from "../interfaces";
import { ContextAlerta } from "../contexts/ContextAlert";

import utils from "../utils";

let abortController: AbortController | undefined;
export const LIMITE_POR_BUSCA_CONTRATO = 50;

export default function useContrato() {
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
        async (params?: tQueryParamsContrato): Promise<tContrato[]> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setArrBuscando((current) => [...current, true]);
                    const res = await api.findContracts(params, signal);
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
        async (id: string): Promise<tContrato> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setArrBuscandoPorId((current) => [...current, true]);
                    const res = await api.getContract(id, signal);
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
        async (contratos: tNovoContrato[]): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setEstaCriando(true);
                    await api.createContract(contratos, signal);
                    setSucesso(contratos.length > 1 ? "Contratos adicionados!" : "Contrato adicionado!");
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
        async (contrato: tNovoContrato & PartialEntity<tContrato, "id">): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<void>(async (resolve, reject) => {
                try {
                    setEstaEditando(true);
                    await api.updateContract(contrato, signal);
                    setSucesso("Contrato editado!");
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

            return new Promise(async (resolve, reject) => {
                try {
                    setEstaDeletando(true);
                    await api.deleteContract(id, signal);
                    setSucesso("Contrato deletado!");
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
