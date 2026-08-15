import { Customer, CustomerQueryProps, EditCustomerData, NewCustomer, NewImportCustomer } from "../types/customer";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import api from "../services/api";
import utils from "../utils";

let abortController: AbortController | undefined;
export const LIMITE_POR_BUSCA_CLIENTE = 50;

export default function useCliente() {
    //CONTEXTOS
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    //ESTADOS
    const [arrBuscando, setArrBuscando] = useState<true[]>([]);
    const [arrBuscandoPorId, setArrBuscandoPorId] = useState<true[]>([]);
    const [estaCriando, setEstaCriando] = useState(false);
    const [estaImportando, setEstaImportando] = useState(false);
    const [estaDeletando, setEstaDeletando] = useState(false);
    const [estaEditando, setEstaEditando] = useState(false);
    const [buscaComErro, setBuscaComErro] = useState(false);

    const buscar = useCallback(
        async (params?: CustomerQueryProps): Promise<Customer[]> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setArrBuscando((current) => [...current, true]);
                    const res = await api.findCustomers(params, signal);
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
        async (customerId: string): Promise<Customer> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setArrBuscandoPorId((current) => [...current, true]);
                    const res = await api.getCustomer(customerId, signal);
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

    const importar = useCallback(
        async (clientes: NewImportCustomer[]): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setEstaImportando(true);
                    await api.importCustomers(clientes, signal);
                    setSucesso(clientes.length > 1 ? "Clientes importados!" : "Cliente importado!");
                    resolve();
                } catch (err) {
                    if (utils.blErroCancelamento(err)) return;
                    setPerigo(utils.retornaMensagemErro(err));
                    reject(err);
                } finally {
                    setEstaImportando(false);
                }
            });
        },
        [setPerigo, setSucesso]
    );

    const criar = useCallback(
        async (clientes: NewCustomer[]): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setEstaCriando(true);
                    await api.createCustomers(clientes, signal);
                    setSucesso(clientes.length > 1 ? "Clientes adicionados!" : "Cliente adicionado!");
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
        async (cliente: EditCustomerData): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setEstaEditando(true);
                    await api.updateCustomer(cliente, signal);
                    setSucesso("Cliente editado!");
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
                    await api.deleteCustomer(id, signal);
                    setSucesso("Cliente deletado!");
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
        estaImportando,
        buscaComErro,
        buscar,
        buscarPorId,
        criar,
        editar,
        deletar,
        cancelar,
        importar,
    };
}
