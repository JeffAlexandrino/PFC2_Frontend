import { Button, Form, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IMaskInput } from "react-imask";
import { v4 } from "uuid";

import utils from "../../utils";

import "./styles.css";

interface IInputTextoProps {
    valor: string;
    setValor: (valor: string) => void | Promise<void>;
    mask?: string;
    functionMask?: (valor: string) => string;
    onCancel?: () => void;
    cannotEdit?: boolean;
}

const FORM_CONTROL_ID = v4();

export default function InputTexto({ cannotEdit, ...props }: IInputTextoProps) {
    //ESTADOS
    const [editando, setEditando] = useState(false);
    const [valorInterno, setValorInterno] = useState(props.valor);
    const [mouseOnOver, setMouseOnOver] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const refForm = useRef<HTMLFormElement>(null);
    const refInput = useRef(null);

    //VARIAVEIS
    const { valor, setValor, onCancel } = props;

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
            setTimeout(() => elInput?.focus(), 100);
        }
    }, [cannotEdit]);

    const handleOnAccept = useCallback((valor: any) => setValorInterno(valor), []);
    const handleOnChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => setValorInterno(event.target.value),
        []
    );
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
            } finally {
                setCarregando(false);
                setEditando(false);
            }
        },
        [valorInterno, setValor, carregando]
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
                    {props.functionMask ? props.functionMask(props.valor) : props.valor}
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
                        value={valorInterno}
                        mask={props.mask}
                        unmask
                        onChange={!props.mask ? handleOnChange : undefined}
                        onAccept={props.mask ? handleOnAccept : undefined}
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
