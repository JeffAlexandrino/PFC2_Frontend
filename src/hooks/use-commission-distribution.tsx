import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

import * as T from "../types/commission-distribution";

let findManyController: AbortController | undefined = undefined;
let getOneController: AbortController | undefined = undefined;
let createController: AbortController | undefined = undefined;
let deleteController: AbortController | undefined = undefined;
let updateController: AbortController | undefined = undefined;

export default function useCommissionDistribution() {
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    //ESTADOS
    const [findingManyDistributions, setFindingManyDistributions] = useState(false);
    const [gettingDistribution, setGettingDistribution] = useState(false);
    const [creatingDistribution, setCreatingDistribution] = useState(false);
    const [deletingDistribution, setDeletingDistribution] = useState(false);
    const [updatingDistribution, setUpdatingDistribution] = useState(false);

    const findManyDistributions = useCallback(
        async (params?: T.CommissionDistributionQueryProps): Promise<T.CommissionDistribution[]> => {
            findManyController = new AbortController();
            const signal = findManyController.signal;

            try {
                setFindingManyDistributions(true);
                const res = await api.findCommissionDistributions(params, signal);
                return res.data;
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return [];
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setFindingManyDistributions(false);
            }
        },
        [setPerigo]
    );

    const cancelFindManyDistributions = useCallback(() => findManyController?.abort(), []);

    const getOneDistribution = useCallback(
        async (id: string): Promise<T.CommissionDistribution | null> => {
            getOneController = new AbortController();
            const signal = getOneController.signal;

            try {
                setGettingDistribution(true);
                const res = await api.getCommissionDistribution(id, signal);
                return res.data;
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return null;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setGettingDistribution(false);
            }
        },
        [setPerigo]
    );

    const cancelGetOneDistribution = useCallback(() => getOneController?.abort(), []);

    const createDistributions = useCallback(
        async (data: T.NewCommissionDistribution[]): Promise<void> => {
            createController = new AbortController();
            const signal = createController.signal;

            try {
                setCreatingDistribution(true);
                await api.createCommissionsDistributions(data, signal);
                setSucesso(data.length > 1 ? "Distribuição adicionadas!" : "Distribuição adicionada!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setCreatingDistribution(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelCreateDistributions = useCallback(() => createController?.abort(), []);

    const updateDistribution = useCallback(
        async (props: T.EditCommissionDistributionData): Promise<void> => {
            updateController = new AbortController();
            const signal = updateController.signal;

            try {
                setUpdatingDistribution(true);
                await api.editCommissionDistribution(props, signal);
                setSucesso("Distribuição editada!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setUpdatingDistribution(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelUpdateDistribution = useCallback(() => updateController?.abort(), []);

    const deleteDistribution = useCallback(
        async (id: string): Promise<void> => {
            deleteController = new AbortController();
            const signal = deleteController.signal;

            try {
                setDeletingDistribution(true);
                await api.deleteCommissionDistribution(id, signal);
                setSucesso("Distribuição deletada!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setDeletingDistribution(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelDeleteDistribution = useCallback(() => deleteController?.abort(), []);

    return {
        findManyDistributions,
        cancelFindManyDistributions,
        getOneDistribution,
        cancelGetOneDistribution,
        createDistributions,
        cancelCreateDistributions,
        updateDistribution,
        cancelUpdateDistribution,
        deleteDistribution,
        cancelDeleteDistribution,
        findingManyDistributions,
        gettingDistribution,
        creatingDistribution,
        updatingDistribution,
        deletingDistribution,
    };
}
