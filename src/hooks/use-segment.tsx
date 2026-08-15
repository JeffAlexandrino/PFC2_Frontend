import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";
import { Segment } from "../types/segment";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

let findManyController: AbortController | undefined = undefined;

export default function useSegment() {
    const { setPerigo } = useContext(ContextAlerta);
    const [findingSegments, setFindingSegments] = useState(false);

    const findManySegments = useCallback(async (): Promise<Segment[]> => {
        return new Promise(async (resolve, reject) => {
            findManyController = new AbortController();
            const signal = findManyController.signal;

            try {
                setFindingSegments(true);
                const res = await api.findSegments(signal);
                resolve(res.data);
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                reject(error);
            } finally {
                setFindingSegments(false);
            }
        });
    }, [setPerigo]);

    const cancelFindManySegments = useCallback(() => findManyController?.abort(), []);

    return { findingSegments, findManySegments, cancelFindManySegments };
}
