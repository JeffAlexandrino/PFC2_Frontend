import { Form, FormCheckProps } from "react-bootstrap";
import React, { useCallback, useState } from "react";

export type InputCheckboxProps = Omit<FormCheckProps, "onChange" | "type"> & {
    onChangeChecked?: (checked: boolean) => void;
};

export default function InputCheckbox({
    onChangeChecked,
    className,
    checked,
    defaultChecked,
    ...props
}: InputCheckboxProps) {
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

    const handleOnChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (onChangeChecked) onChangeChecked(event.target.checked);
            setInternalChecked(event.target.checked);
        },
        [onChangeChecked]
    );

    return (
        <Form.Check
            {...props}
            className={["div-checkbox", className].join(" ")}
            type="checkbox"
            onChange={handleOnChange}
            checked={checked ?? internalChecked}
        />
    );
}
