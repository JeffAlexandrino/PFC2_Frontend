import useUserRole from "../../hooks/use-user-role";
import SelectMenu from "./SelectMenu";

import { useCallback, useContext, useEffect, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { OffcanvasForm } from "../offcanvas-form";
import { UserRole } from "../../types/user-role";
import { Role } from "../../types/commom";

type SelectUserRoleProps = {
    selectedId?: string | null;
    setSelectedId?: (id: string | null) => void;
    defaultFirst?: boolean;
    size?: "sm";
    role: Role;
};

export default function SelectUserRole({ selectedId, setSelectedId, role, defaultFirst }: SelectUserRoleProps) {
    const {
        findUsersRole: findManyUsersRole,
        cancelFindUsersRole: cancelFindManyUsersRole,
        findingUsersRole,
    } = useUserRole();

    const { canAddUserRole, canReadUserRoles, currentUserRole } = useContext(ContextUser);
    const { canEditUserByUserRole, canDeleteUserRole } = useContext(ContextUser);

    const [findUserRoleWithError, setFindUserRoleWithError] = useState(false);
    const [userRoles, setUserRoles] = useState<UserRole[]>([]);
    const [search, setSearch] = useState("");

    const [showAdd, setShowAdd] = useState(false);
    const [userRoleDeleting, setUserRoleDeleting] = useState<UserRole | null>(null);
    const [userRoleUpdating, setUserRoleUpdating] = useState<UserRole | null>(null);

    const [defaultFirstInitiallized, setDefaultFirstInitialized] = useState(false);

    const filteredUserRoles = userRoles.filter((userRole) =>
        userRole.user.name.toLowerCase().includes(search.toLowerCase())
    );

    const formatedValues = filteredUserRoles.map((userRole) => ({
        ...userRole,
        texto: userRole.user.name,
        selecionado: selectedId === userRole.id,
    }));

    const findUserRoles = useCallback(() => {
        if (canReadUserRoles({ role }))
            findManyUsersRole({ where: { role } })
                .then((userRoles) => {
                    setUserRoles(userRoles);
                    setFindUserRoleWithError(false);
                })
                .catch((err) => {
                    console.error(err);
                    setFindUserRoleWithError(true);
                });
        else if (canReadUserRoles({ id: currentUserRole?.id, role }))
            findManyUsersRole({ where: { id: currentUserRole?.id, role } })
                .then((userRoles) => {
                    setUserRoles(userRoles);
                    setFindUserRoleWithError(false);
                })
                .catch((err) => {
                    console.error(err);
                    setFindUserRoleWithError(true);
                });
    }, [findManyUsersRole, canReadUserRoles, currentUserRole, role]);

    useEffect(() => {
        findUserRoles();
        return () => cancelFindManyUsersRole();
    }, [findUserRoles, cancelFindManyUsersRole]);

    const handleOnClickAdicionar = useCallback(() => setShowAdd(true), []);

    const handleOnClickEditar = useCallback(
        (id: string) => {
            const userRoleUpdating = userRoles.find((userRole) => userRole.id === id);
            setUserRoleUpdating(userRoleUpdating ?? null);
        },
        [userRoles]
    );
    const handleOnClickDeletar = useCallback(
        (id: string) => {
            const userRoleDeleting = userRoles.find((userRole) => userRole.id === id);
            if (userRoleDeleting) setUserRoleDeleting(userRoleDeleting);
        },
        [userRoles]
    );

    const handleOnClickManager = useCallback(
        (id: string) => {
            if (!setSelectedId) return;

            const selectedUserRole = userRoles.find((manager) => manager.id === id);
            if (!selectedUserRole) return;

            if (selectedUserRole.id === selectedId) return setSelectedId(null);
            setSelectedId(selectedUserRole.id);
        },
        [setSelectedId, userRoles, selectedId]
    );

    useEffect(() => {
        if (!defaultFirst || selectedId || defaultFirstInitiallized) return;

        const firstUserRole = userRoles.at(0);
        if (!firstUserRole) return;

        setDefaultFirstInitialized(true);
        handleOnClickManager(firstUserRole.id);
    }, [defaultFirst, handleOnClickManager, userRoles, selectedId, defaultFirstInitiallized]);

    const getTextManagerSelected = useCallback((): string => {
        if (!selectedId) return "--- Nenhum ---";

        const userRoleSelected = userRoles.find(({ id }) => id === selectedId);
        if (!userRoleSelected) return "--- Nenhum ---";
        return userRoleSelected.user.name;
    }, [selectedId, userRoles]);

    return (
        <>
            <SelectMenu
                setPesquisa={setSearch}
                valores={formatedValues}
                texto={getTextManagerSelected()}
                onOpenMenu={findUserRoleWithError ? findUserRoles : undefined}
                onClickAdicionar={canAddUserRole({}) ? handleOnClickAdicionar : undefined}
                onClickItem={handleOnClickManager}
                onClickDeletar={canDeleteUserRole({}) ? handleOnClickDeletar : undefined}
                onClickEditar={canEditUserByUserRole({}) ? handleOnClickEditar : undefined}
                carregando={findingUsersRole}
                closeOnSelect
            />

            <OffcanvasForm.User.Add show={showAdd} onHide={() => setShowAdd(false)} onDone={findUserRoles} />

            <OffcanvasForm.User.Edit
                userToEdit={userRoleUpdating ? { ...userRoleUpdating.user, userRoles: [userRoleUpdating] } : null}
                onHide={() => setUserRoleUpdating(null)}
                onDone={() => {
                    setUserRoleUpdating(null);
                    findUserRoles();
                }}
            />

            <OffcanvasForm.User.Delete
                userToDelete={
                    userRoleDeleting ? { ...userRoleDeleting.user, userRoles: [userRoleDeleting] } : undefined
                }
                onHide={() => setUserRoleDeleting(null)}
                onDone={() => {
                    setUserRoleDeleting(null);
                    findUserRoles();
                }}
            />
        </>
    );
}
