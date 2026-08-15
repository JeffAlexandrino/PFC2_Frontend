import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Button, Form, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { IMaskInput } from "react-imask";
import { v4 } from "uuid";

import utils from "../../utils";

import "./styles.css";

interface IInputTextoPorcentagemProps {
    valor: number;
    setValor: (valor: number) => void | Promise<void>;
    mask?: string;
    functionMask?: (valor: string) => string;
    onCancel?: () => void;
    cannotEdit?: boolean;
}

const FORM_CONTROL_ID = v4();

export default function InputTextoPorcentagem({ cannotEdit, ...props }: IInputTextoPorcentagemProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //ESTADOS
    const [editando, setEditando] = useState(false);
    const [valorInterno, setValorInterno] = useState(props.valor);
    const [mouseOnOver, setMouseOnOver] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const refForm = useRef<HTMLFormElement>(null);
    const refInput = useRef(null);

    //VARIAVEIS
    const { valor, setValor, onCancel } = props;
    const valorFormatado = valor.toFixed(2).replace(".", ",") + " %";
    const valorInternoFormatado = valorInterno.toFixed(2).replace(".", ",") + " %";

    //EVENTOS
    const handleOnCancelEdit = useCallback(() => {
        setEditando(false);
        setValorInterno(valor);
        if (onCancel) onCancel();
    }, [valor, onCancel]);

    const handleOnMouseDown = useCallback(
        (event: MouseEvent) => {
            const elForm = refForm.current;
            if (elForm && elForm !== event.target && !elForm.contains(event.target as Node))
                return handleOnCancelEdit();
        },
        [handleOnCancelEdit]
    );

    useEffect(() => {
        //Necessário em caso de atualizar o valor externamente
        setValorInterno(valor);

        document.addEventListener("mousedown", handleOnMouseDown);
        return () => document.removeEventListener("mousedown", handleOnMouseDown);
    }, [handleOnMouseDown, valor]);

    const handleOnOver = useCallback(() => setMouseOnOver(true), []);
    const handleOnOut = useCallback(() => setMouseOnOver(false), []);

    const handleOnClickLabel = useCallback(() => {
        if (cannotEdit) return;
        setEditando(true);
        const elMaskInput = refInput.current;
        if (elMaskInput) {
            //TODO: Não tem forma do refInput saber que está lidando com um IMaskInput ao invés de um Input?
            const elInput = (elMaskInput as any).element;
            const cursorPosition = valorInternoFormatado.length - 2;
            setTimeout(() => {
                elInput?.focus();
                elInput.setSelectionRange(cursorPosition, cursorPosition);
            }, 100);
        }
    }, [valorInternoFormatado, cannotEdit]);

    const handleOnChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target;
        const value = event.target.value;
        const numericValue = value.replace(/\D/g, "");

        // Chama o onAccept com o valor numérico
        setValorInterno(Number(numericValue) / 100);

        // Mover o cursor para antes do último dígito
        const valorFormatado = (Number(numericValue) / 100).toFixed(2).replace(".", ",") + "%";
        const cursorPosition = valorFormatado.length - 1;
        setTimeout(() => {
            input.setSelectionRange(cursorPosition, cursorPosition);
        }, 0);
    }, []);

    const handleSubmit = useCallback(
        async (event: React.SyntheticEvent<HTMLFormElement>) => {
            event.preventDefault();

            if (carregando) return;
            setCarregando(true);
            try {
                await setValor(valorInterno);
            } catch (err) {
                if (utils.blErroCancelamento(err)) return;
                console.error(err);
                setPerigo(utils.retornaMensagemErro(err));
            } finally {
                setCarregando(false);
                setEditando(false);
            }
        },
        [valorInterno, setValor, carregando, setPerigo]
    );

    return (
        <>
            <OverlayTrigger
                delay={200}
                overlay={<Tooltip className={cannotEdit ? "d-none" : ""}>Clique para editar</Tooltip>}
            >
                <label
                    htmlFor={FORM_CONTROL_ID}
                    className={`${editando ? "d-none" : "text-info"}`}
                    role="button"
                    onClick={handleOnClickLabel}
                >
                    {valorFormatado}
                </label>
            </OverlayTrigger>

            <Form
                ref={editando ? refForm : undefined}
                className={`${!editando ? "d-none" : "w-100 position-relative"}`}
                onSubmit={handleSubmit}
            >
                <Form.Group onMouseOver={handleOnOver} onMouseOut={handleOnOut} controlId={FORM_CONTROL_ID}>
                    <Form.Control
                        name="valorInput"
                        ref={refInput}
                        size="sm"
                        as={IMaskInput}
                        value={valorInternoFormatado}
                        onChange={!props.mask ? handleOnChange : undefined}
                    />
                    <div
                        className={`d-flex position-absolute end-0 top-0 h-100 align-items-center me-1 gap-1 ${
                            mouseOnOver || carregando ? "" : "opacity-0"
                        }`}
                    >
                        <Button
                            size="sm"
                            variant="success"
                            title="Aceitar"
                            type="submit"
                            className="my-button-input rounded-circle d-flex justify-content-center align-items-center p-0"
                        >
                            {carregando ? <Spinner size="sm" /> : <i className="bi bi-check fs-5" />}
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="my-button-input rounded-circle d-flex justify-content-center align-items-center p-0"
                            title="Cancelar"
                            onClick={handleOnCancelEdit}
                        >
                            <i className="bi bi-x fs-5" />
                        </Button>
                    </div>
                </Form.Group>
            </Form>
        </>
    );
}
