import { OffcanvasFormResetProps } from "./types";
import { OffcanvasFormContext } from "./root";
import { Button } from "react-bootstrap";
import { useContext } from "react";

export default function Reset({ variant, form, onClick, ...props }: OffcanvasFormResetProps) {
    const { formId, onHide } = useContext(OffcanvasFormContext);

    return (
        <Button
            {...props}
            onClick={onClick ?? onHide}
            form={form ?? formId}
            type="reset"
            variant={variant ?? "outline-secondary-dark"}
        />
    );
}
