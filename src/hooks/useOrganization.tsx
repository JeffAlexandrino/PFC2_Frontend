import { EditOrganizationData, OrganizationQueryProps, Organization } from "../types/organization";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import api from "../services/api";
import utils from "../utils";

let abortController: AbortController | undefined;
export const LIMIT_SEARCH_ORGANIZATION = 50;

export default function useOrganization() {
    //CONTEXTOS
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    //ESTADOS
    const [arrFinding, setArrFinding] = useState<true[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [errorToFind, setErrorToFind] = useState(false);

    const find = useCallback(
        async (params?: OrganizationQueryProps): Promise<Organization[]> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setArrFinding((current) => [...current, true]);
                    const res = await api.findOrganizations(params, signal);
                    setErrorToFind(false);
                    resolve(res.data);
                } catch (err) {
                    if (utils.blErroCancelamento(err)) return;
                    setPerigo(utils.retornaMensagemErro(err));
                    setErrorToFind(true);
                    reject(err);
                } finally {
                    setArrFinding((current) => current.slice(1));
                }
            });
        },
        [setPerigo]
    );

    const update = useCallback(
        async (organizationData: EditOrganizationData): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setIsUpdating(true);
                    await api.updateOrganization(organizationData, signal);
                    setSucesso("Dados da empresa atualizados!");
                    resolve();
                } catch (err) {
                    if (utils.blErroCancelamento(err)) return;
                    setPerigo(utils.retornaMensagemErro(err));
                    reject(err);
                } finally {
                    setIsUpdating(false);
                }
            });
        },
        [setPerigo, setSucesso]
    );

    const cancel = useCallback(() => abortController?.abort(), []);

    return {
        isFinding: arrFinding.length > 0,
        isUpdating,
        errorToFind,
        find,
        update,
        cancel,
    };
}
