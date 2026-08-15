import { tNovoFabricante } from "../components/forms/FormFabricante";
import api, { tQueryParamsFabricante } from "../services/api";
import { PartialEntity, tFabricante } from "../interfaces";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import utils from "../utils";

let abortController: AbortController | undefined;
export const LIMITE_POR_BUSCA_FABRICANTE = 50;

export default function useFabricante() {
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
        async (params?: tQueryParamsFabricante): Promise<tFabricante[]> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<tFabricante[]>(async (resolve, reject) => {
                try {
                    setArrBuscando((current) => [...current, true]);
                    const res = await api.findManufacturers(signal);
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
        async (id: string): Promise<tFabricante> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<tFabricante>(async (resolve, reject) => {
                try {
                    setArrBuscandoPorId((current) => [...current, true]);
                    const res = await api.getManufacturer(id, signal);
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
        async (fabricantes: tNovoFabricante[]): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<void>(async (resolve, reject) => {
                try {
                    setEstaCriando(true);
                    await api.createManufacturer(fabricantes, signal);
                    setSucesso(fabricantes.length > 1 ? "Fabricantes adicionados!" : "Fabricante adicionado!");
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
        async (fabricante: tNovoFabricante & PartialEntity<tFabricante, "id">): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<void>(async (resolve, reject) => {
                try {
                    setEstaEditando(true);
                    await api.updateManufacturer(fabricante, signal);
                    setSucesso("Fabricante editado!");
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
                    await api.deleteManufacturer(id, signal);
                    setSucesso("Fabricante deletado!");
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
