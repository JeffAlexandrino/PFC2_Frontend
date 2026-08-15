import { UserRole, FindUserRoleParams } from "../types/user-role";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

let findManyController: AbortController | undefined = undefined;

export default function useUserRole() {
    const { setPerigo } = useContext(ContextAlerta);

    const [findingUsersRole, setFindingUsersRole] = useState(false);

    const findUsersRole = useCallback(
        async (params?: FindUserRoleParams): Promise<UserRole[]> => {
            findManyController = new AbortController();
            const signal = findManyController.signal;

            try {
                setFindingUsersRole(true);
                const res = await api.findUserRoles(params, signal);
                return res.data;
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return [];
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setFindingUsersRole(false);
            }
        },
        [setPerigo]
    );

    const cancelFindUsersRole = useCallback(() => findManyController?.abort(), []);

    return {
        findingUsersRole,
        findUsersRole,
        cancelFindUsersRole,
    };
}
