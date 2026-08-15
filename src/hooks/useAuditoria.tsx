import api, { tQueryParamsAuditoria } from "../services/api";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";
import { tAuditoria } from "../interfaces";

import utils from "../utils";

let abortController: AbortController | undefined;
export const LIMITE_POR_BUSCA_AUDITORIA = 50;

export default function useAuditoria() {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //ESTADOS
    const [arrBuscando, setArrBuscando] = useState<true[]>([]);
    const [buscaComErro, setBuscaComErro] = useState(false);

    const buscar = useCallback(
        async (params?: tQueryParamsAuditoria): Promise<tAuditoria[]> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setArrBuscando((current) => [...current, true]);
                    const res = await api.listaAuditorias(params, signal);
                    setBuscaComErro(false);
                    resolve(res.data);
                } catch (err) {
                    if (utils.blErroCancelamento(err)) return;
                    setPerigo(utils.retornaMensagemErro(err));
                    setBuscaComErro(true);
                    reject(err);
                } finally {
                    setArrBuscando((current) => current.slice(1));
                }
            });
        },
        [setPerigo]
    );

    const cancelar = useCallback(() => abortController?.abort(), []);

    return {
        estaBuscando: arrBuscando.length > 0,
        buscaComErro,
        buscar,
        cancelar,
    };
}
