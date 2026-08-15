import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";
import { Category } from "../types/category";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

let findManyController: AbortController | undefined = undefined;

export default function useCategory() {
    const { setPerigo } = useContext(ContextAlerta);
    const [findingCategories, setFindingCategories] = useState(false);

    const findManyCategories = useCallback(async (): Promise<Category[]> => {
        findManyController = new AbortController();
        const signal = findManyController.signal;

        return new Promise(async (resolve, reject) => {
            try {
                setFindingCategories(true);
                const res = await api.findCategories(signal);
                resolve(res.data);
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                reject(error);
            } finally {
                setFindingCategories(false);
            }
        });
    }, [setPerigo]);

    const cancelFindManyCategories = useCallback(() => findManyController?.abort(), []);

    return { findingCategories, findManyCategories, cancelFindManyCategories };
}
