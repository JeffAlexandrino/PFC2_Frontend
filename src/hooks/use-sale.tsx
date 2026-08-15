import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

import * as T from "../types/sale";

let findManyController: AbortController | undefined = undefined;
let updateController: AbortController | undefined = undefined;
let createController: AbortController | undefined = undefined;
let deleteController: AbortController | undefined = undefined;
let getReportsController: AbortController | undefined = undefined;

//the actual search of filtered colums its done by the API, not in the client
// Each new filter is a new search, a new get from API, with the filter value added
export default function useSale() {
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    const [findingSales, setFindingSales] = useState<boolean>(false);
    const [updatingSale, setUpdatingSale] = useState<boolean>(false);
    const [creatingSale, setCreatingSale] = useState<boolean>(false);
    const [deletingSale, setDeletingSale] = useState<boolean>(false);
    const [gettingSalesReports, setGettingSalesReports] = useState<boolean>(false);

    //For reports, it has 1 controller for the 2 reports func, to only allow one at a time
    const findManySales = useCallback(
        async (params?: T.FindSalesParams): Promise<T.Sale[]> => {
            findManyController = new AbortController();
            const signal = findManyController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setFindingSales(true);
                    const res = await api.findSales(params, signal);
                    resolve(res.data);
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setFindingSales(false);
                }
            });
        },
        [setPerigo]
    );

    const cancelFindManySales = useCallback(() => {
        if (findManyController) findManyController.abort();
    }, []);

    const updateSale = useCallback(
        async (
            editSaleData: T.EditSaleData,
            params: T.SaleUpdateParams,
            reasonRegressionStatus?: string
        ): Promise<void> => {
            updateController = new AbortController();
            const signal = updateController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setUpdatingSale(true);
                    await api.updateSale(editSaleData, params, reasonRegressionStatus, signal);
                    setSucesso("Venda editada!");
                    resolve();
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setUpdatingSale(false);
                }
            });
        },
        [setPerigo, setSucesso]
    );

    const cancelUpdateSale = useCallback(() => {
        if (updateController) updateController.abort();
    }, []);

    const createSale = useCallback(
        async (data: T.NewSale[]): Promise<void> => {
            createController = new AbortController();
            const signal = createController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setCreatingSale(true);
                    await api.createSales(data, signal);
                    setSucesso(data.length > 1 ? "Vendas adicionadas!" : "Venda adicionada!");
                    resolve();
                } catch (err) {
                    if (AxiosErrorUtil.isAnAbort(err)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(err));
                    reject(err);
                } finally {
                    setCreatingSale(false);
                }
            });
        },
        [setPerigo, setSucesso]
    );

    const cancelCreateSale = useCallback(() => {
        if (createController) createController.abort();
    }, []);

    const deleteSale = useCallback(
        async (id: string, params: T.SaleDeleteParams): Promise<void> => {
            deleteController = new AbortController();
            const signal = deleteController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setDeletingSale(true);
                    await api.deleteSale(id, params, signal);
                    setSucesso("Venda deletada!");
                    resolve();
                } catch (err) {
                    if (AxiosErrorUtil.isAnAbort(err)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(err));
                    reject(err);
                } finally {
                    setDeletingSale(false);
                }
            });
        },
        [setPerigo, setSucesso]
    );

    const cancelDeleteSale = useCallback(() => {
        if (deleteController) deleteController.abort();
    }, []);

    const getSalesClientReports = useCallback(
        async (salesIds: string[], params?: T.GetSalesReportParams): Promise<Blob> => {
            getReportsController = new AbortController();
            const signal = getReportsController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setGettingSalesReports(true);
                    const res = await api.getSalesClientReports(
                        salesIds.length > 0 ? salesIds : undefined,
                        params,
                        signal
                    );
                    resolve(res.data);
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setGettingSalesReports(false);
                }
            });
        },
        [setPerigo]
    );

    const cancelGetSaleClientReports = useCallback(() => getReportsController?.abort(), []);

    const getSalesUserReports = useCallback(
        async (salesIds: string[], params?: T.GetSalesReportParams): Promise<Blob> => {
            getReportsController = new AbortController();
            const signal = getReportsController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setGettingSalesReports(true);
                    const res = await api.getSalesUserReports(
                        salesIds.length > 0 ? salesIds : undefined,
                        params,
                        signal
                    );
                    resolve(res.data);
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setGettingSalesReports(false);
                }
            });
        },
        [setPerigo]
    );

    const cancelGetSaleUserReports = useCallback(() => getReportsController?.abort(), []);

    return {
        findingSales,
        findManySales,
        cancelFindManySales,

        updatingSale,
        updateSale,
        cancelUpdateSale,

        creatingSale,
        createSale,
        cancelCreateSale,

        deletingSale,
        deleteSale,
        cancelDeleteSale,

        gettingSalesReports,
        getSalesClientReports,
        cancelGetSaleClientReports,
        getSalesUserReports,
        cancelGetSaleUserReports,
    };
}
