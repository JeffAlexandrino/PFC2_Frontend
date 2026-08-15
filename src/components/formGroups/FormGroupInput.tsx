import { CurrencyType } from "../../types/commom";
import { ReactNode, useCallback } from "react";
import { Col, Form } from "react-bootstrap";
import { IMaskInput } from "react-imask";
import { v4 } from "uuid";

import InputPorcentagem from "../inputs/InputPorcentagem";
import InputTextArea from "../inputs/InputTextArea";
import InputValores from "../inputs/InputValores";
import InputSenha from "../inputs/InputSenha";
import InputDate from "../inputs/InputDate";

export enum FormGroupInputType {
    TEXT = "text",
    NUMBER = "number",
    PASSWORD = "password",
    MONETARY = "monetary",
    PORCENT = "porcent",
    DATE = "date",
    TEXT_AREA = "text-area",
}

export type FormGroupInputProps = {
    label?: ReactNode;
    error?: string;
    sm?: string;
    required?: boolean;
    setValue: (value: any) => void;
    children?: ReactNode;
    disabled?: boolean;
    mask?: string | string[];
    stringNullable?: boolean;
    placeholder?: string;
} & (
    | {
          type: FormGroupInputType.TEXT | FormGroupInputType.PASSWORD;
          value: string;
      }
    | { type: FormGroupInputType.TEXT_AREA; value: string; rows?: number; max?: number }
    | {
          type: FormGroupInputType.NUMBER | FormGroupInputType.PORCENT;
          value: number;
          min?: number;
      }
    | {
          type: FormGroupInputType.MONETARY;
          tipoMoeda: CurrencyType;
          value: number;
      }
    | {
          type: FormGroupInputType.DATE;
          value: Date;
          useLastTime?: boolean;
      }
);

export default function FormGroupInput({ setValue, stringNullable, ...props }: FormGroupInputProps) {
    const handleOnAccept = useCallback(
        (value: any) => {
            if (value === "" && stringNullable) setValue(null);
            else setValue(value);
        },
        [setValue, stringNullable]
    );

    return (
        <Form.Group as={Col} sm={props.sm ?? "12"} controlId={v4()} data-test="form-group">
            <Form.Label className="mb-1" data-test="form-label">
                {props.label}
            </Form.Label>
            {props.type === FormGroupInputType.PORCENT ? (
                <InputPorcentagem
                    placeholder={props.placeholder}
                    disabled={props.disabled}
                    required={props.required}
                    valor={props.value}
                    onAccept={(markup) => handleOnAccept(markup)}
                    isInvalid={!!props.error}
                />
            ) : props.type === FormGroupInputType.MONETARY ? (
                <InputValores
                    placeholder={props.placeholder}
                    disabled={props.disabled}
                    required={props.required}
                    moeda={props.tipoMoeda}
                    valor={props.value}
                    onAccept={(value) => handleOnAccept(value)}
                    isInvalid={!!props.error}
                />
            ) : props.type === FormGroupInputType.DATE ? (
                <InputDate
                    placeholder={props.placeholder}
                    disabled={props.disabled}
                    required={props.required}
                    useLastTime={props.useLastTime}
                    valor={props.value}
                    onAccept={(value) => handleOnAccept(value)}
                    isInvalid={!!props.error}
                />
            ) : props.type === FormGroupInputType.TEXT_AREA ? (
                <InputTextArea
                    placeholder={props.placeholder}
                    disabled={props.disabled}
                    required={props.required}
                    rows={props.rows}
                    max={props.max}
                    value={props.value}
                    onChange={(e) => handleOnAccept(e.target.value)}
                    isInvalid={!!props.error}
                />
            ) : props.type === FormGroupInputType.PASSWORD ? (
                <InputSenha
                    placeholder={props.placeholder}
                    disabled={props.disabled}
                    required={props.required}
                    valor={props.value}
                    onAccept={(password) => handleOnAccept(password)}
                    isInvalid={!!props.error}
                    error={props.error}
                />
            ) : (
                <Form.Control
                    placeholder={props.placeholder}
                    as={props.mask ? IMaskInput : undefined}
                    mask={props.mask}
                    unmask={props.mask ? true : undefined}
                    disabled={props.disabled}
                    required={props.required}
                    type={props.type}
                    value={props.value}
                    min={props.type === FormGroupInputType.NUMBER ? props.min : undefined}
                    {...(props.mask ? { onAccept: (value: any) => handleOnAccept(value) } : {})}
                    onChange={(e) => {
                        if (props.type === FormGroupInputType.NUMBER) return handleOnAccept(Number(e.target.value));
                        if (!props.mask) return handleOnAccept(e.target.value);
                    }}
                    isInvalid={!!props.error}
                />
            )}

            <Form.Control.Feedback type="invalid">{props.error}</Form.Control.Feedback>
            {props.children}
        </Form.Group>
    );
}
