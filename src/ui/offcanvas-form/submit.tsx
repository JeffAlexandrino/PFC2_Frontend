import { OffcanvasFormSubmitProps } from "./types";
import { Button, Spinner } from "react-bootstrap";
import { OffcanvasFormContext } from "./root";
import { useContext } from "react";

export default function Submit({ disabled, form, pending, ...props }: OffcanvasFormSubmitProps) {
    const { formId } = useContext(OffcanvasFormContext);

    return (
        <div className="position-relative">
            <Button {...props} form={formId} disabled={pending ? true : disabled} type="submit" />
            {pending && (
                <div className="d-flex top-0 start-0 position-absolute w-100 h-100 justify-content-center align-items-center bg-dark bg-opacity-25 rounded">
                    <Spinner size="sm" className="text-white" />
                </div>
            )}
        </div>
    );
}
