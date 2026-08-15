import useUserColumns from "../hooks/table-columns/use-user-columns";
import useOnChangeFilter from "../hooks/use-onchange-filter";
import TableConstructor from "../ui/table/constructor";
import UserRoleUtil from "../utils/user-role.util";
import FrontRoutes from "../lib/front-routes";
import UserUtil from "../utils/user.util";
import useUser from "../hooks/use-user";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BotaoAdicionarDado, ModalAuditoriaUser } from "../components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { OffcanvasForm } from "../components/offcanvas-form";
import { ActionTable, SortTable } from "../ui/table/type";
import { ContextUser } from "../contexts/ContextUser";
import { Dropdown } from "../components/dropdowns";
import { User, UserWhere } from "../types/user";
import { LayoutTable } from "../layouts/table";
import { Role } from "../types/commom";

import * as FilterButtons from "../components/botoes/filters";

export default function Users() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { canAddUser, canUpdateUser, canDeleteUser, canReadUser, usuario, canReadAudit, canReadTarget } =
        useContext(ContextUser);
    const { onClearFilters } = useOnChangeFilter();

    const { findManyUsers, cancelFindManyUsers, findingUsers } = useUser();

    const [users, setUsers] = useState<User[]>([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [sortMode, setSortMode] = useState<SortTable<User> | null>(null);

    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [userToManageRoles, setUserToManageRoles] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [userToAudit, setUserToAudit] = useState<User | null>(null);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [showAddUser, setShowAddUser] = useState(false);

    const activedFilters = useMemo(() => UserUtil.getFilterValuesBy(searchParams), [searchParams]);
    const activedFiltersCount = Object.values(activedFilters).filter((v) => v).length;

    const loadUsers = useCallback(() => {
        let where: UserWhere = UserUtil.getWhereParamsBy(searchParams);
        if (!canReadUser(where)) where = { ...where, onlyComercialNotManagerRoles: "true" };
        if (!canReadUser(where)) where = { ...where, id: usuario?.id };

        findManyUsers({
            limit: UserUtil.DEFAULT_LIMIT_PER_PAGE,
            page: currentPage,
            sortBy: sortMode?.by,
            sortType: sortMode?.type,
            where,
        })
            .then(setUsers)
            .catch(console.error);
    }, [searchParams, currentPage, sortMode, findManyUsers, usuario, canReadUser]);

    useEffect(() => {
        loadUsers();
        return () => cancelFindManyUsers();
    }, [cancelFindManyUsers, loadUsers]);

    const { getOneUser } = useUser();

    const userTableActions = useMemo(
        (): ((user: User) => ActionTable[]) => (user) => {
            const userRoles = user.userRoles.map((userRole) => userRole.role);

            const hasComercialRole = UserRoleUtil.hasComercialRole(userRoles);
            const hasOnlyComercialNotManagerRoles = UserRoleUtil.hasOnlyComercialNotManagerRoles(userRoles);
            const canReadSomeTarget = user.userRoles.some(({ id, role }) =>
                canReadTarget({ userRoleId: id, userRole: role })
            );

            return [
                canReadAudit({ tabela: "USUARIO" }) && {
                    actionDescription: "Auditar",
                    action: () => setUserToAudit(user),
                },

                canUpdateUser({ onlyComercialNotManagerRoles: hasOnlyComercialNotManagerRoles ? "true" : "false" }) && {
                    actionDescription: "Gerenciar papéis",
                    action: async () => {
                        try {
                            const fullUser = await getOneUser(user.id);
                            if (fullUser) setUserToManageRoles(fullUser);
                        } catch (err) {}
                    },
                },

                hasComercialRole &&
                    canReadSomeTarget && {
                        actionDescription: "Visualizar metas",
                        action: () => navigate(FrontRoutes.getTargetsUser(user.id)),
                    },

                canUpdateUser({ onlyComercialNotManagerRoles: hasOnlyComercialNotManagerRoles ? "true" : "false" }) && {
                    actionDescription: "Editar",
                    action: () => setUserToEdit(user),
                },

                canDeleteUser({ onlyComercialNotManagerRoles: hasOnlyComercialNotManagerRoles ? "true" : "false" }) && {
                    actionDescription: "Desativar",
                    action: () => setUserToDelete(user),
                },
            ].filter((action) => action !== false);
        },
        [canReadAudit, canUpdateUser, canDeleteUser, canReadTarget, navigate, getOneUser, setUserToManageRoles]
    );

    const handleOnDone = useCallback(() => {
        loadUsers();
        setShowAddUser(false);
        setUserToEdit(null);
        setUserToDelete(null);
        setUserToManageRoles(null);
    }, [loadUsers]);

    //Only show Blocked users to Manager Roles and  Commission_Analyst
    //Only show Admin users to Manager Roles and Commission_Analyst
    const FilterUsers = canReadAudit({ tabela: "USUARIO" })
        ? users
        : users.filter(
              (user) =>
                  user.bloqueado !== true &&
                  !user.userRoles.some((r) => r.role === Role.ADMIN) &&
                  !user.userRoles.some((r) => r.role === Role.MONITOR)
          );

    return (
        <>
            <LayoutTable.Root>
                <LayoutTable.Header className="justify-content-between">
                    <div className="d-flex gap-2">
                        {activedFiltersCount !== 0 && (
                            <FilterButtons.ClearFilters activedFilters={activedFiltersCount} onClick={onClearFilters} />
                        )}
                    </div>
                    {canAddUser({ role: Role.VENDEDOR }) && (
                        <BotaoAdicionarDado texto="Usuário" onClickAdd={() => setShowAddUser(true)} />
                    )}
                </LayoutTable.Header>
                <LayoutTable.Body>
                    {canReadAudit({ tabela: "USUARIO" }) && (
                        <>
                            <div className="d-flex gap-2">
                                <Dropdown.UserReports
                                    users={FilterUsers}
                                    selectedUsersIds={selectedUsers.map(({ id }) => id)}
                                />
                            </div>
                        </>
                    )}
                    <TableConstructor
                        tableName="Usuarios"
                        data={FilterUsers}
                        columns={useUserColumns()}
                        actions={userTableActions}
                        selection={useMemo(() => ({ dataId: "id" as keyof User, onSelect: setSelectedUsers }), [])}
                        onChangeCurrentPage={setCurrentPage}
                        onChangeSortModeColumn={setSortMode}
                        processing={findingUsers}
                    />
                </LayoutTable.Body>
            </LayoutTable.Root>

            <ModalAuditoriaUser show={userToAudit !== null} user={userToAudit} onHide={() => setUserToAudit(null)} />
            <OffcanvasForm.User.Add show={showAddUser} onHide={() => setShowAddUser(false)} onDone={loadUsers} />
            <OffcanvasForm.User.Edit userToEdit={userToEdit} onHide={() => setUserToEdit(null)} onDone={handleOnDone} />
            <OffcanvasForm.User.ManageRoles
                userToManageRoles={userToManageRoles}
                onHide={() => setUserToManageRoles(null)}
                onDone={handleOnDone}
            />
            <OffcanvasForm.User.Delete
                userToDelete={userToDelete}
                onHide={() => setUserToDelete(null)}
                onDone={handleOnDone}
            />
        </>
    );
}
