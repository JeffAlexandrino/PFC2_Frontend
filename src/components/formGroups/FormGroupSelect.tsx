import { Col, Form } from "react-bootstrap";
import { ReactNode } from "react";
import { v4 } from "uuid";

export type FormGroupSelectProps<T> = {
    label?: ReactNode;
    error?: string;
    sm?: string;
    setValue: (value: T) => void;
    children?: ReactNode;
    disabled?: boolean;
    value: T;
    options: T[];
    optionTextFn?: (option: T) => string;
    disableOptionFn?: (option: T) => boolean;
};

export default function FormGroupSelect<T extends string>(props: FormGroupSelectProps<T>) {
    return (
        <Form.Group as={Col} sm={props.sm ?? "12"} controlId={v4()} data-test="form-group">
            <Form.Label className="mb-1" data-test="form-label">
                {props.label}
            </Form.Label>
            <Form.Select
                disabled={props.disabled}
                value={props.value}
                onChange={(e) => props.setValue(e.target.value as T)}
                isInvalid={!!props.error}
            >
                {props.options.map((option) => (
                    <option
                        value={option}
                        key={option}
                        disabled={props.disableOptionFn ? props.disableOptionFn(option) : false}
                    >
                        {props.optionTextFn ? props.optionTextFn(option) : option}
                    </option>
                ))}
            </Form.Select>

            <Form.Control.Feedback type="invalid">{props.error}</Form.Control.Feedback>
            {props.children}
        </Form.Group>
    );
}
