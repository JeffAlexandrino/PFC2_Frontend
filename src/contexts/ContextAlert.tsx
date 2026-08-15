import { createContext, ReactNode, useCallback, useState } from "react";
import { Button } from "react-bootstrap";
import { Alerta } from "../components";
import { v4 as uuidv4 } from "uuid";
import Modal from "../ui/modal";
import ApiRoutes from "../lib/api-routes";
import api from "../services/api";

export const ContextAlerta = createContext<{
    setSucesso: (msg: string) => void;
    setAviso: (msg: string) => void;
    setPerigo: (msg: string) => void;
    setProcessando: (processando: boolean) => void;
    setConfirmar: (msg: ReactNode) => Promise<boolean | string>;
    setConfirmReason: (reason: string) => void;
    confirmReason: string;
    alertas: IAlerta[];
    refreshVersion: () => Promise<void>;
}>({
    setSucesso: (msg: string) => {},
    setAviso: (msg: string) => {},
    setPerigo: (msg: string) => {},
    alertas: [],
    setProcessando: (processando: boolean) => {},
    setConfirmar: async (msg: ReactNode) => false,
    setConfirmReason: (reason: string) => {},
    confirmReason: "",
    refreshVersion: async () => {},
});

export interface IAlerta {
    id: string;
    msg: string;
    date: Date;
    variant: "success" | "warning" | "danger";
    onClose: () => void;
}

export default function ProviderAlerta(props: { children: JSX.Element }) {
    //ESTADOS
    const [processando, setProcessando] = useState(false);
    const [alertas, setAlerta] = useState<IAlerta[]>([]);

    const [confirmReason, setConfirmReason] = useState("");
    const [confirmMsg, setConfirmMsg] = useState<ReactNode | null>(null);
    const [resolveCallback, setResolveCallback] = useState<((value: boolean | string) => void) | null>(null);

    //EVENTOS
    const fechaAlerta = useCallback((id: string) => {
        setAlerta((alertas) => alertas.filter((alerta) => alerta.id !== id));
    }, []);

    const criaAlerta = useCallback(
        (msg: string, variant: "success" | "warning" | "danger") => {
            const id = uuidv4();
            const date = new Date();

            setAlerta((alertas) => [
                ...alertas.filter((alerta) => alerta.msg !== msg),
                { id, msg, date, variant, onClose: () => fechaAlerta(id) },
            ]);
        },
        [fechaAlerta]
    );

    const refreshVersion = useCallback(async () => {
        setProcessando(true);
        try {
            const response = await api.getApiVersion();
            const version = response.data;
            ApiRoutes.patchVersion(version);
        } catch (err) {
            console.error("Error fetching API version:", err);
        } finally {
            setProcessando(false);
        }
    }, []);

    const setSucesso = useCallback((msg: string) => criaAlerta(msg, "success"), [criaAlerta]);
    const setAviso = useCallback((msg: string) => criaAlerta(msg, "warning"), [criaAlerta]);
    const setPerigo = useCallback((msg: string) => criaAlerta(msg, "danger"), [criaAlerta]);

    const setConfirmar = useCallback(async (msg: ReactNode) => {
        setConfirmMsg(msg);
        return new Promise<boolean>(function (resolve) {
            setResolveCallback(() => resolve);
        });
    }, []);

    const handleOnClickConfirm = useCallback(() => {
        if (resolveCallback && confirmReason !== "") resolveCallback(confirmReason);
        else if (resolveCallback) resolveCallback(true);
        setConfirmMsg(null);
        setConfirmReason("");
    }, [resolveCallback, confirmReason]);
    const handleOnClickCancel = useCallback(() => {
        if (resolveCallback) resolveCallback(false);
        setConfirmMsg(null);
    }, [resolveCallback]);

    return (
        <ContextAlerta.Provider
            value={{
                setSucesso,
                setAviso,
                setPerigo,
                alertas,
                setProcessando,
                setConfirmar,
                setConfirmReason,
                confirmReason,
                refreshVersion,
            }}
        >
            <Alerta />
            {props.children}

            <Modal.Root centered={false} backdrop="static" size="sm" show={processando} keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Por favor aguarde</Modal.Title>
                </Modal.Header>
                <Modal.Body>Processando sua solicitação...</Modal.Body>
            </Modal.Root>

            <Modal.Root centered={false} show={confirmMsg !== null} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Deseja continuar?</Modal.Title>
                </Modal.Header>
                <Modal.Body>{confirmMsg}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleOnClickCancel}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleOnClickConfirm}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal.Root>
        </ContextAlerta.Provider>
    );
}
