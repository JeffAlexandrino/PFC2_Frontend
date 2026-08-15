import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { User } from "../../../types/user";
import { useCallback } from "react";

import UserRoleUtil from "../../../utils/user-role.util";
import useUser from "../../../hooks/use-user";

type DeleteProps = {
    userToDelete?: Pick<User, "id" | "name" | "userRoles"> | null;
    onDone?: () => void;
    onHide?: () => void;
};

export default function Delete({ userToDelete, onHide, onDone }: DeleteProps) {
    const { deleteUser, deletingUser, cancelDeleteUser } = useUser();

    const handleOnDelete = useCallback(() => {
        if (!userToDelete) return;
        const userRoles = userToDelete.userRoles.map(({ role }) => role);
        const onlyComercialNotManagerRoles = UserRoleUtil.hasOnlyComercialNotManagerRoles(userRoles) ? "true" : "false";
        deleteUser(userToDelete.id, { onlyComercialNotManagerRoles })
            .then(onDone)
            .catch((err) => console.error(err));
    }, [onDone, userToDelete, deleteUser]);

    const handleOnCancel = useCallback(() => {
        if (onHide) onHide();
        cancelDeleteUser();
    }, [onHide, cancelDeleteUser]);

    return (
        <OffcanvasForm.Root show={!!userToDelete} onHide={handleOnCancel}>
            <OffcanvasForm.Header>
                <OffcanvasForm.Title>Desativar Usuário</OffcanvasForm.Title>
            </OffcanvasForm.Header>

            <OffcanvasForm.Body>
                <OffcanvasForm.WarningMessage className="d-flex flex-column gap-2 h-100 w-100">
                    <p className="mb-1">
                        Você está prestes a <strong>desativar permanentemente</strong> o usuário:
                    </p>

                    <ul className="mb-2" style={{ lineHeight: "1.6" }}>
                        <li>
                            <strong>Nome:</strong> {userToDelete?.name}
                        </li>
                    </ul>

                    <div className="mb-2">
                        <p className="mb-1">Esta ação resultará em:</p>
                        <ul style={{ lineHeight: "1.6", marginLeft: "1rem" }}>
                            <li>Impedir a visualização desse usuário no sistema;</li>
                            <li>Os dados referenciados a esse usuário permanecerão;</li>
                        </ul>
                    </div>

                    <p className="mb-0">
                        Esta ação <strong className="text-danger">não poderá ser desfeita</strong>. Clique em{" "}
                        <strong>Desativar</strong> para confirmar.
                    </p>
                </OffcanvasForm.WarningMessage>

                <OffcanvasForm.Footer>
                    <OffcanvasForm.Reset onClick={onHide}>Cancelar</OffcanvasForm.Reset>
                    <OffcanvasForm.Submit
                        onClick={handleOnDelete}
                        pending={deletingUser}
                        variant="danger"
                        className="text-white"
                    >
                        Desativar
                    </OffcanvasForm.Submit>
                </OffcanvasForm.Footer>
            </OffcanvasForm.Body>
        </OffcanvasForm.Root>
    );
}
