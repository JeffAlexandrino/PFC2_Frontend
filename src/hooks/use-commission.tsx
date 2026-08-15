import { PayOneCommissioProps, FindCommissionsParams, CommissionInfoPerUser } from "../types/commission";
import { GetCommissionReportParams, DataToggleCommissionDistributorPaid } from "../types/commission";
import { Commission, GetCommissionInfoPerUserParams } from "../types/commission";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

let findManyController: AbortController | undefined = undefined;
let updateController: AbortController | undefined = undefined;
let getInfoPerRoleController: AbortController | undefined = undefined;
let updatePaymentStatusController: AbortController | undefined = undefined;
let getReportsController: AbortController | undefined = undefined;
let approveManyController: AbortController | undefined = undefined;
let toggleDistributorPaidController: AbortController | undefined = undefined;
let disableOneController: AbortController | undefined = undefined;

//the actual search of filtered colums its done by the API, not in the client
// Each new filter is a new search, a new get from API, with the filter value added
export default function useCommission() {
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    const [findingCommissions, setFindingCommissions] = useState<boolean>(false);
    const [updatingCommissions, setUpdatingCommissions] = useState<boolean>(false);
    const [gettingCommissionInfoPerRole, setGettingCommissionInfoPerRole] = useState<boolean>(false);
    const [updatingCommissionsPaymentStatus, setUpdatingCommissionsPaymentStatus] = useState<boolean>(false);
    const [gettingCommissionReports, setGettingCommissionReports] = useState<boolean>(false);
    const [approvingManyCommissions, setApprovingManyCommissions] = useState<boolean>(false);
    const [togglingCommissionDistributorPaid, setTogglingCommissionDistributorPaid] = useState<boolean>(false);
    const [disablingOneCommission, setDisablingOneCommission] = useState<boolean>(false);

    const findManyCommissions = useCallback(
        async (params?: FindCommissionsParams): Promise<Commission[]> => {
            findManyController = new AbortController();
            const signal = findManyController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setFindingCommissions(true);
                    const res = await api.findComissions(params, signal);
                    resolve(res.data);
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setFindingCommissions(false);
                }
            });
        },
        [setPerigo]
    );

    const cancelFindManyCommissions = useCallback(() => {
        if (findManyController) findManyController.abort();
    }, []);

    const updateCommission = useCallback(
        async (editCommissionData: PayOneCommissioProps): Promise<void> => {
            updateController = new AbortController();
            const signal = updateController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setUpdatingCommissions(true);

                    await api.payOneCommission(editCommissionData, signal);

                    setSucesso("Estado de venda alterado para Pago.");
                    resolve();
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setUpdatingCommissions(false);
                }
            });
        },
        [setPerigo, setSucesso]
    );

    const cancelUpdateCommission = useCallback(() => {
        if (updateController) updateController.abort();
    }, []);

    const getCommissionInfoPerRole = useCallback(
        async (params: GetCommissionInfoPerUserParams): Promise<CommissionInfoPerUser[]> => {
            getInfoPerRoleController = new AbortController();
            const signal = getInfoPerRoleController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setGettingCommissionInfoPerRole(true);

                    const res = await api.getCommissionInfoPerRole(params, signal);
                    resolve(res.data);
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setGettingCommissionInfoPerRole(false);
                }
            });
        },
        [setPerigo, setGettingCommissionInfoPerRole]
    );

    const cancelGetCommissionInfoPerRole = useCallback(() => {
        if (getInfoPerRoleController) getInfoPerRoleController.abort();
    }, []);

    const updateCommissionsPaymentStatus = useCallback(
        async (ids: string[]) => {
            updatePaymentStatusController = new AbortController();
            const signal = updatePaymentStatusController.signal;

            return new Promise<void>(async (resolve, reject) => {
                try {
                    setUpdatingCommissionsPaymentStatus(true);
                    await api.payManyCommissions(ids, signal);
                    setSucesso("Comissões pagas!");
                    resolve();
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setUpdatingCommissionsPaymentStatus(false);
                }
            });
        },
        [setSucesso, setPerigo]
    );

    const cancelUpdateCommissionPaymentStatus = useCallback(() => {
        if (updatePaymentStatusController) updatePaymentStatusController.abort();
    }, []);

    const getCommissionReports = useCallback(
        async (commissionIds: string[], params?: GetCommissionReportParams): Promise<Blob> => {
            getReportsController = new AbortController();
            const signal = getReportsController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setGettingCommissionReports(true);
                    const res = await api.getCommissionReports(
                        commissionIds.length > 0 ? commissionIds : undefined,
                        params,
                        signal
                    );
                    resolve(res.data);
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setGettingCommissionReports(false);
                }
            });
        },
        [setPerigo]
    );

    const cancelGetCommissionReports = useCallback(() => getReportsController?.abort(), []);

    const approveManyCommissions = useCallback(
        async (comissoesId: string[]) => {
            approveManyController = new AbortController();
            const signal = approveManyController.signal;

            try {
                setApprovingManyCommissions(true);
                await api.approveManyCommissions(comissoesId, signal);
                setSucesso(comissoesId.length > 1 ? "Comissões aprovadas!" : "Comissão aprovada!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setApprovingManyCommissions(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelApproveManyCommissions = useCallback(() => approveManyController?.abort(), []);

    const toggleCommissionDistributorPaid = useCallback(
        async (data: DataToggleCommissionDistributorPaid) => {
            toggleDistributorPaidController = new AbortController();
            const signal = toggleDistributorPaidController.signal;

            try {
                setTogglingCommissionDistributorPaid(true);
                await api.toggleCommissionDistributorPaid(data, signal);
                setSucesso("Comissão atualizada!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setTogglingCommissionDistributorPaid(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelToggleCommissionDistributorPaid = useCallback(() => toggleDistributorPaidController?.abort(), []);

    const disableOneCommission = useCallback(
        async (commissionId: string) => {
            disableOneController = new AbortController();
            const signal = disableOneController.signal;

            try {
                setDisablingOneCommission(true);
                await api.disableOneCommission(commissionId, signal);
                setSucesso("Comissão desativada!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setDisablingOneCommission(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelDisableOneCommission = useCallback(() => disableOneController?.abort(), []);

    return {
        findManyCommissions,
        findingCommissions,
        cancelFindManyCommissions,

        updateCommission,
        updatingCommissions,
        cancelUpdateCommission,

        getCommissionInfoPerRole,
        gettingCommissionInfoPerRole,
        cancelGetCommissionInfoPerRole,

        updateCommissionsPaymentStatus,
        updatingCommissionsPaymentStatus,
        cancelUpdateCommissionPaymentStatus,

        getCommissionReports,
        gettingCommissionReports,
        cancelGetCommissionReports,

        approveManyCommissions,
        approvingManyCommissions,
        cancelApproveManyCommissions,

        toggleCommissionDistributorPaid,
        togglingCommissionDistributorPaid,
        cancelToggleCommissionDistributorPaid,

        disableOneCommission,
        disablingOneCommission,
        cancelDisableOneCommission,
    };
}
