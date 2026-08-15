import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";
import { Manufacturer } from "../types/manufacturer";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

let findManyController: AbortController | undefined = undefined;

export default function useManufacturer() {
    const { setPerigo } = useContext(ContextAlerta);

    const [findingManufacturers, setFindingManufacturers] = useState(false);

    const findManyManufacturers = useCallback(async (): Promise<Manufacturer[]> => {
        findManyController = new AbortController();
        const signal = findManyController.signal;

        return new Promise(async (resolve, reject) => {
            try {
                setFindingManufacturers(true);
                const res = await api.findManufacturers(signal);
                resolve(res.data);
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                reject(error);
            } finally {
                setFindingManufacturers(false);
            }
        });
    }, [setPerigo]);

    const cancelFindManyManufacturers = useCallback(() => findManyController?.abort(), []);

    return { findingManufacturers, findManyManufacturers, cancelFindManyManufacturers };
}
