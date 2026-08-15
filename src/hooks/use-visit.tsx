import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

import * as T from "../types/visits";

let findManyController: AbortController | undefined = undefined;
let updateController: AbortController | undefined = undefined;
let getExpenseInfoPerRoleController: AbortController | undefined = undefined;
let payController: AbortController | undefined = undefined;
let getReportController: AbortController | undefined = undefined;
let deleteController: AbortController | undefined = undefined;
let createController: AbortController | undefined = undefined;

export default function useVisit() {
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    const [findingVisits, setFindingVisits] = useState(false);
    const [updatingVisit, setUpdatingVisit] = useState(false);
    const [gettingExpensesInfoPerRole, setGettingExpensesInfoPerRole] = useState(false);
    const [updatingVisitsPaymentStatus, setUpdatingVisitsPaymentStatus] = useState(false);
    const [gettingVisitReport, setGettingVisitReport] = useState(false);
    const [deletingVisit, setDeletingVisit] = useState(false);
    const [creatingVisit, setCreatingVisit] = useState(false);

    const findManyVisits = useCallback(
        async (params?: T.FindVisitsParams): Promise<T.Visit[]> => {
            findManyController = new AbortController();
            const signal = findManyController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setFindingVisits(true);
                    const res = await api.findVisits(params, signal);
                    resolve(res.data);
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setFindingVisits(false);
                }
            });
        },
        [setPerigo]
    );

    const cancelFindManyVisits = useCallback(() => findManyController?.abort(), []);

    const updateVisit = useCallback(
        async (udpateData: T.EditVisitData, params: T.VisitDeleteOrUpdateParams): Promise<void> => {
            updateController = new AbortController();
            const signal = updateController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setUpdatingVisit(true);
                    await api.updateVisit(udpateData, params, signal);
                    setSucesso("Saída editada!");
                    resolve();
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setUpdatingVisit(false);
                }
            });
        },
        [setPerigo, setSucesso]
    );

    const cancelUpdateVisit = useCallback(() => findManyController?.abort(), []);

    const getVisitExpenseInfoPerRole = useCallback(
        async (params: T.GetVisitExpensesInfoPerRole): Promise<T.VisitExpenseInfoPerRole[]> => {
            getExpenseInfoPerRoleController = new AbortController();
            const signal = getExpenseInfoPerRoleController.signal;

            return new Promise(async (resolve) => {
                try {
                    setGettingExpensesInfoPerRole(true);
                    const res = await api.getExpensesInfoPerRole(params, signal);
                    resolve(res.data);
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    resolve([]);
                } finally {
                    setGettingExpensesInfoPerRole(false);
                }
            });
        },
        [setPerigo, setGettingExpensesInfoPerRole]
    );

    const cancelGetVisitExpenseInfoPerRole = useCallback(() => getExpenseInfoPerRoleController?.abort(), []);

    const payVisits = useCallback(
        async (visitasId: string[]) => {
            payController = new AbortController();
            const signal = payController.signal;

            return new Promise<void>(async (resolve, reject) => {
                try {
                    setUpdatingVisitsPaymentStatus(true);
                    await api.payVisits(visitasId, signal);
                    setSucesso("A saída foi marcada como paga!");
                    resolve();
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setUpdatingVisitsPaymentStatus(false);
                }
            });
        },
        [setSucesso, setPerigo]
    );

    const cancelPayVisits = useCallback(() => payController?.abort(), []);

    const getVisitReports = useCallback(
        async (visitsIds: string[], params?: T.GetVisitReportParams): Promise<Blob> => {
            getReportController = new AbortController();
            const signal = getReportController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setGettingVisitReport(true);
                    const res = await api.getVisitReport(visitsIds, params, signal);
                    resolve(res.data);
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setGettingVisitReport(false);
                }
            });
        },
        [setPerigo]
    );

    const cancelGetVisitReports = useCallback(() => getReportController?.abort(), []);

    const deleteVisit = useCallback(
        async (visitaIdToDelete: string, params: T.VisitDeleteOrUpdateParams): Promise<void> => {
            deleteController = new AbortController();
            const signal = deleteController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setDeletingVisit(true);
                    await api.deleteVisit(visitaIdToDelete, params, signal);
                    setSucesso("Saída deletada!");
                    resolve();
                } catch (err) {
                    if (AxiosErrorUtil.isAnAbort(err)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(err));
                    reject(err);
                } finally {
                    setDeletingVisit(false);
                }
            });
        },
        [setPerigo, setSucesso]
    );

    const cancelDeleteVisit = useCallback(() => deleteController?.abort(), []);

    const createVisit = useCallback(
        async (data: T.NewVisit[]): Promise<void> => {
            createController = new AbortController();
            const signal = createController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setCreatingVisit(true);
                    await api.createVisits(data, signal);
                    setSucesso(data.length > 1 ? "Saídas adicionadas!" : "Saída adicionada!");
                    resolve();
                } catch (err) {
                    if (AxiosErrorUtil.isAnAbort(err)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(err));
                    reject(err);
                } finally {
                    setCreatingVisit(false);
                }
            });
        },
        [setPerigo, setSucesso]
    );

    const cancelCreateVisit = useCallback(() => createController?.abort(), []);

    return {
        findingVisits,
        findManyVisits,
        cancelFindManyVisits,
        updatingVisit,
        updateVisit,
        cancelUpdateVisit,
        gettingExpensesInfoPerRole,
        getVisitExpenseInfoPerRole,
        cancelGetVisitExpenseInfoPerRole,
        updatingVisitsPaymentStatus,
        payVisits,
        cancelPayVisits,
        gettingVisitReport,
        getVisitReports,
        cancelGetVisitReports,
        deletingVisit,
        deleteVisit,
        cancelDeleteVisit,
        creatingVisit,
        createVisit,
        cancelCreateVisit,
    };
}
