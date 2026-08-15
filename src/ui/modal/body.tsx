import { Modal, Spinner } from "react-bootstrap";
import { useMemo } from "react";

import cn from "../../utils/cn";

export default function Body({
    className,
    loading,
    children,
    ...props
}: Omit<React.ComponentProps<typeof Modal.Body>, "as"> & { loading?: boolean }) {
    return (
        <Modal.Body
            {...props}
            className={cn(["overflow-y-auto overflow-x-hidden", className])}
            style={useMemo(() => ({ maxHeight: "calc(100vh - 15rem)" }), [])}
        >
            {children}
            <div className={cn(["d-flex w-100 justify-content-center", !loading && "d-none"])}>
                <span className="d-flex flex-column align-items-center bg-dark bg-opacity-75 p-2 rounded text-white">
                    <Spinner size="sm" />
                    Carregando...
                </span>
            </div>
        </Modal.Body>
    );
}
