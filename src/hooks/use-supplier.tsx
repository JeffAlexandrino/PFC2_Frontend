import { FindSuppliersParams, NewSupplier, Supplier } from "../types/supplier";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

let findManyController: AbortController | undefined = undefined;
let createController: AbortController | undefined = undefined;

export default function useSupplier() {
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    const [findingSuppliers, setFindingSuppliers] = useState(false);
    const [creatingSupplier, setCreatingSupplier] = useState(false);

    const findManySuppliers = useCallback(
        async (params?: FindSuppliersParams): Promise<Supplier[]> => {
            findManyController = new AbortController();
            const signal = findManyController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setFindingSuppliers(true);
                    const res = await api.findSuppliers(params, signal);
                    resolve(res.data);
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setFindingSuppliers(false);
                }
            });
        },
        [setPerigo]
    );

    const cancelFindManySuppliers = useCallback(() => findManyController?.abort(), []);

    const createSuppliers = useCallback(
        async (newSuppliers: NewSupplier[]): Promise<void> => {
            createController = new AbortController();
            const signal = createController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setCreatingSupplier(true);
                    await api.createSuppliers(newSuppliers, signal);
                    setSucesso(newSuppliers.length > 1 ? "Fornecedores adicionados!" : "Fornecedor adicionado!");
                    resolve();
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setCreatingSupplier(false);
                }
            });
        },
        [setPerigo, setSucesso]
    );

    const cancelCreateSuppliers = useCallback(() => createController?.abort(), []);

    return {
        findingSuppliers,
        findManySuppliers,
        cancelFindManySuppliers,
        creatingSupplier,
        createSuppliers,
        cancelCreateSuppliers,
    };
}
