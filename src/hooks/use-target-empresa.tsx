import {
    DataUpdateOrganizationTarget,
    NewOrganizationTarget,
    OrganizationTarget,
    OrganizationTargetQueryProps,
} from "../types/organization-targets";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

let findManyController: AbortController | undefined = undefined;
let createController: AbortController | undefined = undefined;
let updateController: AbortController | undefined = undefined;
let deleteController: AbortController | undefined = undefined;

export default function useTargetEmpresa() {
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    const [findingManyTargetsEmpresa, setFindingManyTargetsEmpresa] = useState(false);
    const [creatingTargetsEmpresa, setCreatingTargetsEmpresa] = useState(false);
    const [updatingTargetEmpresa, setUpdatingTargetEmpresa] = useState(false);
    const [deletingTargetEmpresa, setDeletingTargetEmpresa] = useState(false);

    const findManyTargetsEmpresa = useCallback(
        async (params: OrganizationTargetQueryProps): Promise<OrganizationTarget[]> => {
            findManyController = new AbortController();
            const signal = findManyController.signal;

            try {
                setFindingManyTargetsEmpresa(true);
                const res = await api.findOrganizationTargets(params, signal);
                return res.data;
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return [];
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setFindingManyTargetsEmpresa(false);
            }
        },
        [setPerigo]
    );

    const cancelFindManyTargetsEmpresa = useCallback(() => findManyController?.abort(), []);

    const createTargetsEmpresa = useCallback(
        async (newTargets: NewOrganizationTarget[]): Promise<void> => {
            createController = new AbortController();
            const signal = createController.signal;

            try {
                setCreatingTargetsEmpresa(true);
                await api.createOrganizationEmpresa(newTargets, signal);
                setSucesso(newTargets.length > 1 ? "Metas adicionadas!" : "Meta adicionada!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setCreatingTargetsEmpresa(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelCreateTargetsEmpresa = useCallback(() => createController?.abort(), []);

    const updateTargetEmpresa = useCallback(
        async (updateData: DataUpdateOrganizationTarget): Promise<void> => {
            updateController = new AbortController();
            const signal = updateController.signal;

            try {
                setUpdatingTargetEmpresa(true);
                const { id, ...data } = updateData;
                await api.updateOrganizationEmpresa({ id, ...data }, signal);
                setSucesso("Meta editada!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setUpdatingTargetEmpresa(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelUpdateTargetEmpresa = useCallback(() => updateController?.abort(), []);

    const deleteTargetEmpresa = useCallback(
        async (id: string): Promise<void> => {
            deleteController = new AbortController();
            const signal = deleteController.signal;

            try {
                setDeletingTargetEmpresa(true);
                //await api.deleteTargetEmpresa(id, signal); // testa mas não deleta
                setSucesso("Meta Empresa fake-delete!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setDeletingTargetEmpresa(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelDeleteTargetEmpresa = useCallback(() => deleteController?.abort(), []);

    return {
        findingManyTargetsEmpresa,
        findManyTargetsEmpresa,
        cancelFindManyTargetsEmpresa,
        creatingTargetsEmpresa,
        createTargetsEmpresa,
        cancelCreateTargetsEmpresa,
        updatingTargetEmpresa,
        updateTargetEmpresa,
        cancelUpdateTargetEmpresa,
        deletingTargetEmpresa,
        deleteTargetEmpresa,
        cancelDeleteTargetEmpresa,
    };
}
