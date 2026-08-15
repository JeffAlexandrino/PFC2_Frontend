import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";
import { Contract } from "../types/contract";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

let findManyController: AbortController | undefined = undefined;

export default function useContract() {
    const { setPerigo } = useContext(ContextAlerta);

    const [findingContracts, setFindingContracts] = useState(false);

    const findManyContracts = useCallback(async (): Promise<Contract[]> => {
        findManyController = new AbortController();
        const signal = findManyController.signal;

        return new Promise(async (resolve, reject) => {
            try {
                setFindingContracts(true);
                const res = await api.findContracts(undefined, signal);
                resolve(res.data);
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                reject(error);
            } finally {
                setFindingContracts(false);
            }
        });
    }, [setPerigo]);

    const cancelFindManyContracts = useCallback(() => findManyController?.abort(), []);

    return { findingContracts, findManyContracts, cancelFindManyContracts };
}
