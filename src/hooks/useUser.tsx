import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";
import { UserSession } from "../types/user";

import api from "../services/api";
import utils from "../utils";

let abortController: AbortController | undefined;
export const LIMITE_POR_BUSCA_USERS = 50;

export default function useUser() {
    //CONTEXTOS
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    //ESTADOS
    const [arrGettingInfo, setArrGettingInfo] = useState<true[]>([]);
    const [estaTrocandoUserRole, setEstaTrocandoUserRole] = useState(false);

    const getInfo = useCallback(async (): Promise<UserSession> => {
        abortController = new AbortController();
        const signal = abortController.signal;

        return new Promise(async (resolve, reject) => {
            try {
                setArrGettingInfo([true]);
                const res = await api.getInfoUsuario(signal);

                resolve(res.data);
            } catch (err) {
                if (utils.blErroCancelamento(err)) return;
                setPerigo(utils.retornaMensagemErro(err));
                reject(err);
            } finally {
                setArrGettingInfo((current) => current.slice(1));
            }
        });
    }, [setPerigo]);

    const trocarCurrentUserRole = useCallback(
        async (empresaRoleId: string): Promise<void> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise<void>(async (resolve, reject) => {
                try {
                    setEstaTrocandoUserRole(true);
                    await api.updateCurrentRole(empresaRoleId, signal);
                    setSucesso("Troca efetuada!");
                    window.location.reload();
                    resolve();
                } catch (err) {
                    if (utils.blErroCancelamento(err)) return;
                    setPerigo(utils.retornaMensagemErro(err));
                    reject(err);
                } finally {
                    setEstaTrocandoUserRole(false);
                }
            });
        },
        [setPerigo, setSucesso]
    );

    const cancelar = useCallback(() => abortController?.abort(), []);

    return {
        isGettingInfo: arrGettingInfo.length > 0,
        estaTrocandoEmpresaRole: estaTrocandoUserRole,
        trocarCurrentUserRole,
        getInfo,
        cancelar,
    };
}
