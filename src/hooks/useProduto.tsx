import { tNovoProduto } from "../components/forms/FormProduto";
import api, { tQueryParamsProduto } from "../services/api";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";
import { PartialEntity, tProduto } from "../interfaces";

import utils from "../utils";

let abortController: AbortController | undefined;
export const LIMITE_POR_BUSCA_PRODUTO = 50;

export default function useProduto() {
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
        async (params?: tQueryParamsProduto): Promise<tProduto[]> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<tProduto[]>(async (resolve, reject) => {
                try {
                    setArrBuscando((current) => [...current, true]);
                    const res = await api.findProducts(params, signal);
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
        async (id: string): Promise<tProduto> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<tProduto>(async (resolve, reject) => {
                try {
                    setArrBuscandoPorId((current) => [...current, true]);
                    const res = await api.getProduct(id, signal);
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
        async (produtos: tNovoProduto[]): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<void>(async (resolve, reject) => {
                try {
                    setEstaCriando(true);
                    await api.createProduct(produtos, signal);
                    setSucesso(produtos.length > 1 ? "Produtos adicionados!" : "Produto adicionado!");
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
        async (produto: tNovoProduto & PartialEntity<tProduto, "id">): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<void>(async (resolve, reject) => {
                try {
                    setEstaEditando(true);
                    await api.updateProduct(produto, signal);
                    setSucesso("Produto editado!");
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
                    await api.deleteProduct(id, signal);
                    setSucesso("Produto deletado!");
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
