import { Col, Form } from "react-bootstrap";
import { ReactNode } from "react";
import { v4 } from "uuid";

export type FormGroupBooleanProps = {
    label?: ReactNode;
    error?: string;
    sm?: string;
    setValue: (value: boolean) => void;
    children?: ReactNode;
    disabled?: boolean;
    value: boolean;
};

export default function FormGroupBoolean(props: FormGroupBooleanProps) {
    return (
        <Form.Group as={Col} sm={props.sm ?? "12"} controlId={v4()} className="mb-2 float-end" data-test="form-group">
            <Form.Label className="mb-1" data-test="form-label">
                {props.label}
            </Form.Label>
            <Form.Check
                role="button"
                type="switch"
                onChange={(e) => props.setValue(e.target.checked)}
                label={props.value ? "Sim" : "Não"}
                checked={props.value}
                isInvalid={!!props.error}
            />
            <Form.Control.Feedback type="invalid">{props.error}</Form.Control.Feedback>
            {props.children}
        </Form.Group>
    );
}
