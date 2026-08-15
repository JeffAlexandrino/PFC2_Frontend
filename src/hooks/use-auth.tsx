import AxiosErrorUtil from "../utils/axios-error.util";
import LocalStorage from "../services/local-storage";
import FrontRoutes from "../lib/front-routes";
import api from "../services/api";

import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";

let resetPasswordController: AbortController | undefined;
let getResetPasswordTokenController: AbortController | undefined;
let signOutController: AbortController | undefined;
let signInController: AbortController | undefined;
let updatePassController: AbortController | undefined;
let updateSessionRoleController: AbortController | undefined;

export default function useAuth() {
    const { setPerigo, setSucesso } = useContext(ContextAlerta);

    const [resetingPassword, setResetingPassword] = useState(false);
    const [gettingResetPasswordToken, setGettingResetPasswordToken] = useState(false);

    const [signingOut, setSigningOut] = useState(false);
    const [signingIn, setSigningIn] = useState(false);

    const [updatingPass, setUpdatingPass] = useState(false);
    const [updatingSessionRole, setUpdatingSessionRole] = useState(false);

    const resetPassword = useCallback(
        async (password: string, token: string): Promise<void> => {
            resetPasswordController = new AbortController();
            const signal = resetPasswordController.signal;

            try {
                setResetingPassword(true);
                await api.mudarSenhaPerdida({ password: password, token }, signal);
                setSucesso("Sua senha foi atualizada!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setResetingPassword(false);
            }
        },
        [setSucesso, setPerigo]
    );

    const cancelResetPassword = useCallback(() => resetPasswordController?.abort(), []);

    const getResetPasswordToken = useCallback(
        async (email: string): Promise<void> => {
            getResetPasswordTokenController = new AbortController();
            const signal = getResetPasswordTokenController.signal;
            const redirect = window.location.origin + FrontRoutes.getCriarSenha();

            try {
                setGettingResetPasswordToken(true);
                await api.recuperarSenha({ email, redirect }, signal);
                setSucesso("As instruções para redefinir sua senha foram enviadas.");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setGettingResetPasswordToken(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelGetResetPasswordToken = useCallback(() => getResetPasswordTokenController?.abort(), []);

    const signOut = useCallback(async (): Promise<void> => {
        signOutController = new AbortController();

        try {
            setSigningOut(true);
            await api.logout();
            window.location.href = window.location.origin + FrontRoutes.getLogin();
            //redirect(FrontRoutes.getLogin()); Gera Erro
            setSucesso("Sessão encerrada!");
        } catch (error) {
            if (AxiosErrorUtil.isAnAbort(error)) return;
            setPerigo(AxiosErrorUtil.getMessageFrom(error));
            throw error;
        } finally {
            setSigningOut(false);
        }
    }, [setPerigo, setSucesso]);

    const cancelSignOut = useCallback(() => signOutController?.abort(), []);

    const signIn = useCallback(
        async (email: string, password: string): Promise<void> => {
            signInController = new AbortController();
            try {
                setSigningIn(true);
                const { data } = await api.login({ email, password });
                LocalStorage.setAccessToken(data.accessToken);
                LocalStorage.setRefreshToken(data.refreshToken);
                window.location.href = window.location.origin + FrontRoutes.getDashboard();
                //redirect(FrontRoutes.getDashboard()); Gera Erro, não loga nos testes
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setSigningIn(false);
            }
        },
        [setPerigo]
    );

    const cancelSignIn = useCallback(() => signInController?.abort(), []);

    const updatePassword = useCallback(
        async (password: string): Promise<void> => {
            updatePassController = new AbortController();
            const signal = updatePassController.signal;
            try {
                setUpdatingPass(true);
                await api.mudarSenhaAtual(password, signal);
                setSucesso("Sua senha foi atualizada!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setUpdatingPass(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelUpdatePassword = useCallback(() => updatePassController?.abort(), []);

    const updateSessionRole = useCallback(
        async (userRoleId: string): Promise<void> => {
            updateSessionRoleController = new AbortController();
            const signal = updateSessionRoleController.signal;

            try {
                setUpdatingSessionRole(true);
                await api.updateCurrentRole(userRoleId, signal);
                window.location.href = window.location.origin + FrontRoutes.getDashboard();
                setSucesso("Sessão atualizada!");
            } catch (error) {
                if (AxiosErrorUtil.isAnAbort(error)) return;
                setPerigo(AxiosErrorUtil.getMessageFrom(error));
                throw error;
            } finally {
                setUpdatingSessionRole(false);
            }
        },
        [setPerigo, setSucesso]
    );

    const cancelUpdateSessionRole = useCallback(() => updateSessionRoleController?.abort(), []);

    return {
        signingIn,
        signIn,
        cancelSignIn,
        signingOut,
        signOut,
        cancelSignOut,
        gettingResetPasswordToken,
        getResetPasswordToken,
        cancelGetResetPasswordToken,
        resetingPassword,
        resetPassword,
        cancelResetPassword,
        updatingPass,
        updatePassword,
        cancelUpdatePassword,
        updatingSessionRole,
        updateSessionRole,
        cancelUpdateSessionRole,
    };
}
