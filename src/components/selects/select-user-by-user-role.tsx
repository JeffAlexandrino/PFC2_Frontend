import useUserRole from "../../hooks/use-user-role";
import SelectMenu from "./SelectMenu";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { OffcanvasForm } from "../offcanvas-form";
import { UserRole } from "../../types/user-role";
import { Role } from "../../types/commom";

type SelectUserByUserRoleProps = {
    role: Role;
    userId?: string | null;
    setUserId?: (id: string | null) => void;
};

export default function SelectUserByUserRole(props: SelectUserByUserRoleProps) {
    const {
        findUsersRole: findManyUsersRole,
        cancelFindUsersRole: cancelFindManyUsersRole,
        findingUsersRole,
    } = useUserRole();

    const {
        canAddUser: podeAdicionarUser,
        canDeleteUser: podeDeletarUser,
        canUpdateUser: podeEditarUser,
    } = useContext(ContextUser);

    const [userRoles, setUserRoles] = useState<UserRole[]>([]);
    const [search, setSearch] = useState("");

    const [showAdd, setShowAdd] = useState(false);
    const [userRoleUpdating, setUserRoleUpdating] = useState<UserRole | null>(null);
    const [userRoleDeleting, setUserRoleDeleting] = useState<UserRole | null>(null);

    const { setUserId, userId, role } = props;

    const filteredUserRoles = userRoles.filter((userRole) =>
        userRole.user.name.toLowerCase().includes(search.toLowerCase())
    );

    const formatedUserRoles = filteredUserRoles.map((userRole) => ({
        ...userRole,
        texto: userRole.user.name,
        selecionado: userId === userRole.user.id,
    }));

    const loadUserRoles = useCallback(() => {
        findManyUsersRole({ where: { role } }).then(setUserRoles).catch(console.error);
    }, [findManyUsersRole, role]);

    useEffect(() => {
        loadUserRoles();
        return () => cancelFindManyUsersRole();
    }, [cancelFindManyUsersRole, loadUserRoles]);

    const handleOnClickUpdate = useCallback(
        (id: string) => {
            const userRoleUpdating = userRoles.find((user) => user.id === id);
            if (userRoleUpdating) setUserRoleUpdating(userRoleUpdating);
        },
        [userRoles]
    );
    const handleOnClickDelete = useCallback(
        (id: string) => {
            const userRoleDeleting = userRoles.find((userRole) => userRole.id === id);
            if (userRoleDeleting) setUserRoleDeleting(userRoleDeleting);
        },
        [userRoles]
    );
    const handleOnSelect = useCallback(
        (id: string) => {
            if (!setUserId) return;

            const selectedUserRole = userRoles.find((userRole) => userRole.id === id);
            if (!selectedUserRole) return;

            if (selectedUserRole.user.id === userId) return setUserId(null);
            setUserId(selectedUserRole.user.id);
        },
        [setUserId, userRoles, userId]
    );

    const selectedUserRoleText = useMemo((): string => {
        if (!userId) return "--- Nenhum ---";

        const userRoleSelected = userRoles.find(({ user }) => user.id === userId);
        if (!userRoleSelected) return "--- Nenhum ---";
        return userRoleSelected.user.name;
    }, [userId, userRoles]);

    return (
        <>
            <SelectMenu
                setPesquisa={setSearch}
                valores={formatedUserRoles}
                onOpenMenu={loadUserRoles}
                texto={selectedUserRoleText}
                onClickAdicionar={podeAdicionarUser({}) ? () => setShowAdd(true) : undefined}
                onClickItem={handleOnSelect}
                onClickDeletar={podeDeletarUser({}) ? handleOnClickDelete : undefined}
                onClickEditar={podeEditarUser({}) ? handleOnClickUpdate : undefined}
                closeOnSelect
                carregando={findingUsersRole}
                placeholder="Pesquise pelo nome"
            />

            {podeAdicionarUser({}) && (
                <OffcanvasForm.User.Add
                    initialRole={role}
                    show={showAdd}
                    onDone={loadUserRoles}
                    onHide={() => setShowAdd(false)}
                />
            )}

            {podeEditarUser({}) && (
                <OffcanvasForm.User.Edit
                    userToEdit={userRoleUpdating ? { ...userRoleUpdating.user, userRoles: [userRoleUpdating] } : null}
                    onDone={loadUserRoles}
                    onHide={() => setUserRoleUpdating(null)}
                />
            )}

            {podeDeletarUser({}) && (
                <OffcanvasForm.User.Delete
                    userToDelete={userRoleDeleting ? { ...userRoleDeleting.user, userRoles: [userRoleDeleting] } : null}
                    onDone={loadUserRoles}
                    onHide={() => setUserRoleDeleting(null)}
                />
            )}
        </>
    );
}
