import { FindServicesParams, Service } from "../types/service";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

let findManyController: AbortController | undefined = undefined;

export default function useService() {
    const { setPerigo } = useContext(ContextAlerta);

    const [findingServices, setFindingServices] = useState(false);

    const findManyServices = useCallback(
        async (params?: FindServicesParams): Promise<Service[]> => {
            findManyController = new AbortController();
            const signal = findManyController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setFindingServices(true);
                    const res = await api.findServices(params, signal);
                    resolve(res.data);
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setFindingServices(false);
                }
            });
        },
        [setPerigo]
    );

    const cancelFindManyServices = useCallback(() => findManyController?.abort(), []);

    return { findingServices, findManyServices, cancelFindManyServices };
}
