import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { Target } from "../../../types/target";
import { Role } from "../../../types/commom";
import { useCallback } from "react";

import UserRoleUtil from "../../../utils/user-role.util";
import useTarget from "../../../hooks/use-target";
import utils from "../../../utils";

type DeleteProps = { targetToDelete?: Target | null; userRole: Role; onDone?: () => void; onHide?: () => void };

export default function Delete({ targetToDelete, onHide, onDone, userRole }: DeleteProps) {
    const { deleteTarget, deletingTarget, cancelDeleteTarget } = useTarget();

    const handleOnDelete = useCallback(() => {
        if (!targetToDelete) return;
        deleteTarget(targetToDelete.id, { userRole }).then(onDone).catch(console.error);
    }, [onDone, targetToDelete, deleteTarget, userRole]);

    const handleOnCancel = useCallback(() => {
        if (onHide) onHide();
        cancelDeleteTarget();
    }, [onHide, cancelDeleteTarget]);

    return (
        <OffcanvasForm.Root show={!!targetToDelete} onHide={handleOnCancel}>
            <OffcanvasForm.Header>
                <OffcanvasForm.Title>Deletar Meta</OffcanvasForm.Title>
            </OffcanvasForm.Header>

            <OffcanvasForm.Body>
                <OffcanvasForm.WarningMessage className="d-flex h-100 w-100">
                    <p>
                        Você está prestes a deletar permanentemente do sistema a meta de{" "}
                        {UserRoleUtil.getRoleDescription(userRole)} no periodo{" "}
                        {targetToDelete && <strong>{utils.retornaPeriodoMeta(targetToDelete)}</strong>}. Clique no botão{" "}
                        <strong className="text-danger">Deletar</strong> logo abaixo para prosseguir.
                    </p>
                </OffcanvasForm.WarningMessage>
                <OffcanvasForm.Footer>
                    <OffcanvasForm.Reset onClick={onHide}>Cancelar</OffcanvasForm.Reset>
                    <OffcanvasForm.Submit
                        onClick={handleOnDelete}
                        pending={deletingTarget}
                        variant="danger"
                        className="text-white"
                    >
                        Deletar
                    </OffcanvasForm.Submit>
                </OffcanvasForm.Footer>
            </OffcanvasForm.Body>
        </OffcanvasForm.Root>
    );
}
