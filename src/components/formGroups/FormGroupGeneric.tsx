import { ChangeEvent, ReactNode } from "react";
import { Col, Form } from "react-bootstrap";
import { v4 } from "uuid";

export type FormGroupGenericProps = {
    label?: ReactNode;
    error?: string;
    sm?: string;
    children?: ReactNode;
    type?: string;
    value?: any;
    setValue?: (value: ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
    align?: "start" | "end";
};

export default function FormGroupGeneric({ align, ...props }: FormGroupGenericProps) {
    const inputId = v4();
    return (
        <Form.Group as={Col} sm={props.sm ?? "12"} className={`text-${align ?? "end"}`} data-test="form-group">
            <Form.Label htmlFor={inputId} className="mb-1" data-test="form-label">
                {props.label}
            </Form.Label>
            <div>{props.children}</div>
            <Form.Control
                accept={props.accept}
                value={props.value}
                onChange={props.setValue}
                type={props.type}
                id={inputId}
                className="d-none"
                isInvalid={!!props.error}
            />
            <Form.Control.Feedback type="invalid">{props.error}</Form.Control.Feedback>
        </Form.Group>
    );
}
