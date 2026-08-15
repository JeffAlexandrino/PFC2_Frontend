import { FindProductsParams, Product } from "../types/product";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

let findManyController: AbortController | undefined = undefined;

export default function useProduct() {
    const { setPerigo } = useContext(ContextAlerta);

    const [findingProducts, setFindingProducts] = useState(false);

    const findManyProducts = useCallback(
        async (params?: FindProductsParams): Promise<Product[]> => {
            findManyController = new AbortController();
            const signal = findManyController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setFindingProducts(true);
                    const res = await api.findProducts(params, signal);
                    resolve(res.data);
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setFindingProducts(false);
                }
            });
        },
        [setPerigo]
    );

    const cancelFindManyProducts = useCallback(() => findManyController?.abort(), []);

    return { findingProducts, findManyProducts, cancelFindManyProducts };
}
