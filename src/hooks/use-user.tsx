import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

import AxiosErrorUtil from "../utils/axios-error.util";
import api from "../services/api";

import * as T from "../types/user";

let findManyController: AbortController | undefined = undefined;
let createController: AbortController | undefined = undefined;
let updateController: AbortController | undefined = undefined;
let deleteController: AbortController | undefined = undefined;
let manageRolesController: AbortController | undefined = undefined;
let getMyUserInfoController: AbortController | undefined = undefined;
let getOneController: AbortController | undefined = undefined;
let getReportsController: AbortController | undefined = undefined;

//the actual search of filtered colums its done by the API, not in the client
// Each new filter is a new search, a new get from API, with the filter value added
export default function useUser() {
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    const [findingUsers, setFindingUsers] = useState(false);
    const [creatingUser, setCreatingUser] = useState(false);
    const [updatingUser, setUpdatingUser] = useState(false);
    const [deletingUser, setDeletingUser] = useState(false);
    const [managingUserRoles, setManagingUserRoles] = useState(false);
    const [gettingMyUserInfo, setGettingMyUserInfo] = useState(false);
    const [gettingOneUser, setGettingOneUser] = useState(false);
    const [gettingUserReports, setGettingUserReports] = useState<boolean>(false);

    const findManyUsers = useCallback(
        async (params?: T.FindUserParams): Promise<T.User[]> => {
            findManyController = new AbortController();
            const signal = findManyController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setFindingUsers(true);
                    const res = await api.findManyUsers(params, signal);
                    resolve(res.data);
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setFindingUsers(false);
                }
            });
        },
        [setPerigo]
    );

    const cancelFindManyUsers = useCallback(() => findManyController?.abort(), []);

    const createUsers = useCallback(
        async (data: T.NewUser[]): Promise<void> => {
            createController = new AbortController();
            const signal = createController.signal;

            try {
                setCreatingUser(true);
                await api.createUsers(data, signal);
                setSucesso(data.length < 2 ? "Usuário criado!" : "Usuários criados!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setCreatingUser(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelCreateUsers = useCallback(() => createController?.abort(), []);

    const updateUser = useCallback(
        async (editUserData: T.DataUpdateUserInfo, params: T.ParamsUpdateOrDeleteUser): Promise<void> => {
            updateController = new AbortController();
            const signal = updateController.signal;

            try {
                setUpdatingUser(true);
                await api.updateUser(editUserData, signal, params);
                setSucesso("Usuário atualizado!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setUpdatingUser(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelUpdateUser = useCallback(() => updateController?.abort(), []);

    const deleteUser = useCallback(
        async (userId: string, params: T.ParamsUpdateOrDeleteUser): Promise<void> => {
            deleteController = new AbortController();
            const signal = deleteController.signal;

            try {
                setDeletingUser(true);
                await api.deleteUser(userId, signal, params);
                setSucesso("Usuário desativado!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setDeletingUser(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelDeleteUser = useCallback(() => deleteController?.abort(), []);

    const ActiveUser = useCallback(
        async (userId: string, params: T.ParamsUpdateOrDeleteUser): Promise<void> => {
            deleteController = new AbortController();
            const signal = deleteController.signal;

            try {
                setDeletingUser(true);
                await api.deleteUser(userId, signal, params);
                setSucesso("Usuário desativado!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setDeletingUser(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelActiveUser = useCallback(() => deleteController?.abort(), []);

    const manageUserRoles = useCallback(
        async (manageUserRoleData: T.DataUpdateUserRole, params: T.ParamsUpdateOrDeleteUser): Promise<void> => {
            manageRolesController = new AbortController();
            const signal = manageRolesController.signal;

            try {
                setManagingUserRoles(true);
                await api.editRoleUser(manageUserRoleData, signal, params);
                setSucesso("Papéis do usuário atualizados!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setManagingUserRoles(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelManageUserRoles = useCallback(() => manageRolesController?.abort(), []);

    const getMyUserInfo = useCallback(async (): Promise<T.UserSession> => {
        getMyUserInfoController = new AbortController();
        const signal = getMyUserInfoController.signal;

        return new Promise(async (resolve, reject) => {
            try {
                setGettingMyUserInfo(true);
                const res = await api.getInfoUsuario(signal);
                resolve(res.data);
            } catch (err) {
                if (AxiosErrorUtil.isAnAbort(err)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(err));
                reject(err);
            } finally {
                setGettingMyUserInfo(false);
            }
        });
    }, [setPerigo]);

    const cancelGetMyUserInfo = useCallback(() => getMyUserInfoController?.abort(), []);

    const getOneUser = useCallback(
        async (userId: string): Promise<T.User | null> => {
            getOneController = new AbortController();
            const signal = getOneController.signal;

            try {
                setGettingOneUser(true);
                const res = await api.getUser(userId, signal);
                return res.data;
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return null;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setGettingOneUser(false);
            }
        },
        [setPerigo]
    );

    const cancelGetOneUser = useCallback(() => getOneController?.abort(), []);

    const getUserReports = useCallback(
        async (usersIds: string[], params?: T.GetUserReportParams): Promise<Blob> => {
            getReportsController = new AbortController();
            const signal = getReportsController.signal;

            return new Promise(async (resolve, reject) => {
                try {
                    setGettingUserReports(true);
                    const res = await api.getUserReports(usersIds.length > 0 ? usersIds : undefined, params, signal);
                    resolve(res.data);
                } catch (error) {
                    if (AxiosErrorUtil.isAnAbort(error)) return;
                    setPerigo(AxiosErrorUtil.getMessageFrom(error));
                    reject(error);
                } finally {
                    setGettingUserReports(false);
                }
            });
        },
        [setPerigo]
    );

    const cancelGetUserReports = useCallback(() => getReportsController?.abort(), []);

    return {
        findingUsers,
        findManyUsers,
        cancelFindManyUsers,

        creatingUser,
        createUsers,
        cancelCreateUsers,

        updatingUser,
        updateUser,
        cancelUpdateUser,

        deletingUser,
        deleteUser,
        cancelDeleteUser,

        ActiveUser,
        cancelActiveUser,

        managingUserRoles,
        manageUserRoles,
        cancelManageUserRoles,

        gettingMyUserInfo,
        getMyUserInfo,
        cancelGetMyUserInfo,

        gettingOneUser,
        getOneUser,
        cancelGetOneUser,

        gettingUserReports,
        getUserReports,
        cancelGetUserReports,
    };
}
