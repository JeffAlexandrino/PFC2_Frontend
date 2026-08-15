import { OffcanvasForm } from "../../ui/offcanvas-form";

import React from "react";

export type OffcanvasDeleteProps = {
    title?: string;
    cancelLabel?: string;
    confirmLabel?: string;
    show: boolean;
    pending?: boolean;
    introText?: React.ReactNode;
    details?: React.ReactNode;

    onHide: () => void;
    onConfirm: () => Promise<void> | void;
};

export default function OffcanvasDelete({
    show,
    title = "Deletar",
    introText = "item",
    details,
    onHide,
    onConfirm,
    pending = false,
    confirmLabel = "Deletar",
    cancelLabel = "Cancelar",
}: OffcanvasDeleteProps) {
    const handleConfirm = async () => {
        await onConfirm();
    };

    return (
        <OffcanvasForm.Root show={show} onHide={onHide}>
            <OffcanvasForm.Header>
                <OffcanvasForm.Title>{title}</OffcanvasForm.Title>
            </OffcanvasForm.Header>
            <OffcanvasForm.Body>
                <OffcanvasForm.WarningMessage className="d-flex flex-column gap-2 h-100 w-100">
                    <p className="mb-1">
                        Você está prestes a <strong>excluir permanentemente</strong> {introText}:
                    </p>

                    {details}

                    <p className="mb-0">
                        Esta ação <strong className="text-danger">não poderá ser desfeita</strong>. Clique em{" "}
                        <strong>{confirmLabel}</strong> para confirmar.
                    </p>
                </OffcanvasForm.WarningMessage>

                <OffcanvasForm.Footer>
                    <OffcanvasForm.Reset onClick={onHide}>{cancelLabel}</OffcanvasForm.Reset>
                    <OffcanvasForm.Submit
                        onClick={handleConfirm}
                        pending={pending}
                        variant="danger"
                        className="text-white"
                    >
                        {confirmLabel}
                    </OffcanvasForm.Submit>
                </OffcanvasForm.Footer>
            </OffcanvasForm.Body>
        </OffcanvasForm.Root>
    );
}
