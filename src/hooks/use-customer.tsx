import { Customer, CustomerQueryProps, NewImportCustomer } from "../types/customer";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

let findManyController: AbortController | undefined = undefined;
let importController: AbortController | undefined = undefined;

export default function useCustomer() {
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    const [findingCustomers, setFindingCustomers] = useState(false);
    const [importingCustomers, setImportingCustomers] = useState(false);

    const findManyCustomers = useCallback(
        async (params?: CustomerQueryProps): Promise<Customer[]> => {
            findManyController = new AbortController();
            const signal = findManyController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setFindingCustomers(true);
                    const res = await api.findCustomers(params, signal);
                    resolve(res.data);
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setFindingCustomers(false);
                }
            });
        },
        [setPerigo]
    );

    const cancelFindManyCustomers = useCallback(() => findManyController?.abort(), []);

    const importCustomers = useCallback(
        async (customers: NewImportCustomer[]): Promise<void> => {
            importController = new AbortController();
            const signal = importController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setImportingCustomers(true);
                    await api.importCustomers(customers, signal);
                    setSucesso(customers.length > 1 ? "Clientes importados!" : "Cliente importado!");
                    resolve();
                } catch (err) {
                    if (AxiosErrorUtil.isAnAbort(err)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(err));
                    reject(err);
                } finally {
                    setImportingCustomers(false);
                }
            });
        },
        [setPerigo, setSucesso]
    );

    const cancelImportCustomers = useCallback(() => importController?.abort(), []);

    return {
        findingCustomers,
        findManyCustomers,
        cancelFindManyCustomers,
        importingCustomers,
        importCustomers,
        cancelImportCustomers,
    };
}
