import UserRoleUtil from "../../utils/user-role.util";
import useUserRole from "../../hooks/use-user-role";
import FiltroSelect from "../../ui/filter/Filter";
import cn from "../../utils/cn";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ButtonGroup, ListGroup, ToggleButton } from "react-bootstrap";
import { getCodename } from "../../lib/constants/codenames";
import { ContextUser } from "../../contexts/ContextUser";
import { SEARCH_PARAMS_KEY } from "../../lib/constants";
import { useSearchParams } from "react-router-dom";
import { UserRole } from "../../types/user-role";
import { Role } from "../../types/commom";

const NENHUM_FILTRO = "Todos usuários do papel";

export default function FilterUserRoleAndRole({ hideValues = false }: { hideValues?: boolean } = {}) {
    const { currentUserRole, canReadDashboard } = useContext(ContextUser);
    const { findUsersRole, findingUsersRole, cancelFindUsersRole } = useUserRole();

    const [findUserRoleWithError, setFindUserRoleWithError] = useState(false);
    const [userRoles, setUserRoles] = useState<UserRole[]>([]);

    const [search, setSearch] = useState<string | undefined>(undefined);
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedRole = (searchParams.get(SEARCH_PARAMS_KEY.ROLE) ?? undefined) as Role | undefined;
    const selectedUserRoleId = searchParams.get(SEARCH_PARAMS_KEY.USER_ROLE_ID) ?? undefined;

    const selectedUserRole = userRoles.find(({ id }) => id === selectedUserRoleId);

    const onlyComercialNotManagerRoles = UserRoleUtil.hasOnlyComercialNotManagerRoles([
        currentUserRole?.role ?? Role.VENDEDOR,
    ])
        ? true
        : false;

    const filteredUserRolesBySearch =
        search === undefined
            ? userRoles
            : userRoles.filter(({ user }) => user.name.toLowerCase().includes(search.toLowerCase()));

    const filterText = useMemo(() => {
        if (selectedUserRole === undefined) return NENHUM_FILTRO;
        else return hideValues ? getCodename(selectedUserRole.user.name) : selectedUserRole.user.name;
    }, [selectedUserRole, hideValues]);

    const loadUserRoles = useCallback(() => {
        if (!selectedRole) return;

        if (canReadDashboard({ role: selectedRole }))
            return findUsersRole({ where: { role: selectedRole } })
                .then(setUserRoles)
                .catch(() => setFindUserRoleWithError(true));

        if (currentUserRole)
            findUsersRole({ where: { id: currentUserRole.id } })
                .then(setUserRoles)
                .catch(() => setFindUserRoleWithError(true));
    }, [findUsersRole, canReadDashboard, selectedRole, currentUserRole]);

    useEffect(() => {
        loadUserRoles();
        return () => cancelFindUsersRole();
    }, [loadUserRoles, cancelFindUsersRole]);

    const handleOnOpenFilters = useCallback(() => {
        if (!findUserRoleWithError) return;

        setFindUserRoleWithError(false);
        loadUserRoles();
    }, [findUserRoleWithError, loadUserRoles]);

    const handleOnSelectUserRole = useCallback(
        (userRole: UserRole | null) => {
            const newSearchParams = new URLSearchParams(searchParams);

            if (!userRole) newSearchParams.delete(SEARCH_PARAMS_KEY.USER_ROLE_ID);
            else newSearchParams.set(SEARCH_PARAMS_KEY.USER_ROLE_ID, userRole.id);

            setSearchParams(newSearchParams);
        },
        [setSearchParams, searchParams]
    );

    const handleOnSelectRole = useCallback(
        (role: Role) => {
            const newSearchParams = new URLSearchParams(searchParams);

            newSearchParams.set(SEARCH_PARAMS_KEY.ROLE, role);
            newSearchParams.delete(SEARCH_PARAMS_KEY.USER_ROLE_ID);

            setSearchParams(newSearchParams);
        },
        [setSearchParams, searchParams]
    );

    return (
        <FiltroSelect
            texto={filterText}
            onSearch={setSearch}
            carregando={findingUsersRole}
            onOpen={handleOnOpenFilters}
            titulo={UserRoleUtil.getRoleDescription(selectedRole ?? Role.VENDEDOR)}
            active={!!selectedUserRole || !!selectedRole}
            disabled={onlyComercialNotManagerRoles}
            customButtonClass="my-user-select"
        >
            <ButtonGroup className={cn([canReadDashboard({}) ? "w-100 mb-2" : "d-none"])}>
                {UserRoleUtil.COMERCIAL_ROLES.map((comercialRole) => (
                    <ToggleButton
                        className={cn([selectedRole === comercialRole ? "text-nowrap" : "text-truncate"])}
                        size="sm"
                        key={comercialRole}
                        id={`radio-${comercialRole}`}
                        type="radio"
                        variant="outline-secondary-dark"
                        name={comercialRole}
                        value={comercialRole}
                        checked={selectedRole === comercialRole}
                        onChange={() => handleOnSelectRole(comercialRole)}
                    >
                        {UserRoleUtil.getRoleDescription(comercialRole)}
                    </ToggleButton>
                ))}
            </ButtonGroup>
            <ListGroup className="small">
                {canReadDashboard({}) && (
                    <ListGroup.Item
                        className={`my-item-filtro text-start ${!selectedUserRoleId ? "bg-light fw-bold text-primary" : ""}`}
                        onClick={() => handleOnSelectUserRole(null)}
                    >
                        {NENHUM_FILTRO}
                    </ListGroup.Item>
                )}
                {filteredUserRolesBySearch.map((userRole) => (
                    <ListGroup.Item
                        className={cn([
                            "my-item-filtro text-start",
                            selectedUserRoleId === userRole.id && "bg-light fw-bold text-primary",
                        ])}
                        key={userRole.id}
                        onClick={() => handleOnSelectUserRole(userRole)}
                    >
                        {hideValues ? getCodename(userRole.user.name) : userRole.user.name}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </FiltroSelect>
    );
}
