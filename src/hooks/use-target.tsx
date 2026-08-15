import { DataUpdateTarget, NewTarget, ParamsCreateTarget, ParamsDeleteTarget } from "../types/target";
import { ParamsUpdateTarget, Target, TargetQueryProps } from "../types/target";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

let findManyController: AbortController | undefined = undefined;
let createController: AbortController | undefined = undefined;
let updateController: AbortController | undefined = undefined;
let deleteController: AbortController | undefined = undefined;

export default function useTarget() {
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    const [findingManyTargets, setFindingManyTargets] = useState(false);
    const [creatingTargets, setCreatingTargets] = useState(false);
    const [updatingTarget, setUpdatingTarget] = useState(false);
    const [deletingTarget, setDeletingTarget] = useState(false);

    const findManyTargets = useCallback(
        async (params: TargetQueryProps): Promise<Target[]> => {
            findManyController = new AbortController();
            const signal = findManyController.signal;

            try {
                setFindingManyTargets(true);
                const res = await api.findTargets(params, signal);
                return res.data;
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return [];
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setFindingManyTargets(false);
            }
        },
        [setPerigo]
    );

    const cancelFindManyTargets = useCallback(() => findManyController?.abort(), []);

    const createTargets = useCallback(
        async (newTargets: NewTarget[], params: Required<ParamsCreateTarget>): Promise<void> => {
            createController = new AbortController();
            const signal = createController.signal;

            try {
                setCreatingTargets(true);
                await api.createTargets(newTargets, signal);
                setSucesso(newTargets.length > 1 ? "Metas adicionadas!" : "Meta adicionada!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setCreatingTargets(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelCreateTargets = useCallback(() => createController?.abort(), []);

    const updateTarget = useCallback(
        async (updateData: DataUpdateTarget, params: Required<ParamsUpdateTarget>): Promise<void> => {
            updateController = new AbortController();
            const signal = updateController.signal;

            try {
                setUpdatingTarget(true);
                const { id, ...data } = updateData;
                await api.updateTarget({ id, ...data }, signal);
                setSucesso("Meta editada!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setUpdatingTarget(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelUpdateTarget = useCallback(() => updateController?.abort(), []);

    const deleteTarget = useCallback(
        async (id: string, params: Required<ParamsDeleteTarget>): Promise<void> => {
            deleteController = new AbortController();
            const signal = deleteController.signal;

            try {
                setDeletingTarget(true);
                await api.deleteTarget(id, signal);
                setSucesso("Meta deletada!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setDeletingTarget(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelDeleteTarget = useCallback(() => deleteController?.abort(), []);

    return {
        findingManyTargets,
        findManyTargets,
        cancelFindManyTargets,
        creatingTargets,
        createTargets,
        cancelCreateTargets,
        updatingTarget,
        updateTarget,
        cancelUpdateTarget,
        deletingTarget,
        deleteTarget,
        cancelDeleteTarget,
    };
}
