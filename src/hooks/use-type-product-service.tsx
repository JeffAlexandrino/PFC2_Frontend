import { TypeProductService } from "../types/type-product-service";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

let findManyController: AbortController | undefined = undefined;

export default function useTypeProductService() {
    const { setPerigo } = useContext(ContextAlerta);

    const [findingTypesProdServ, setFindingTypesProdServ] = useState(false);

    const findManyTypesProdServ = useCallback(async (): Promise<TypeProductService[]> => {
        findManyController = new AbortController();
        const signal = findManyController.signal;

        return new Promise(async (resolve, reject) => {
            try {
                setFindingTypesProdServ(true);
                const res = await api.findTypesProdServ(signal);
                resolve(res.data);
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                reject(error);
            } finally {
                setFindingTypesProdServ(false);
            }
        });
    }, [setPerigo]);

    const cancelFindManyTypesProdServ = useCallback(() => findManyController?.abort(), []);

    return { findingTypesProdServ, findManyTypesProdServ, cancelFindManyTypesProdServ };
}
