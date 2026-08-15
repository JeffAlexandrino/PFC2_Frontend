import { Bloqueado, Role } from "../../types/commom";
import { useSearchParams } from "react-router-dom";
import { Column } from "../../ui/table/type";
import { User } from "../../types/user";
import { useMemo } from "react";

import useOnChangeFilter from "../use-onchange-filter";
import UserRoleUtil from "../../utils/user-role.util";
import UserUtil from "../../utils/user.util";

import * as Span from "../../components/span";

export default function useUserColumns() {
    const { onChangeDate, onChangeText } = useOnChangeFilter();
    const [searchParams] = useSearchParams();

    const activedFilters = useMemo(() => UserUtil.getFilterValuesBy(searchParams), [searchParams]);

    return useMemo((): Column<User>[] => {
        return [
            {
                id: "name", //identifier of the column, make sure its the same as the filter params constants. Its used by the tests too
                headerCell: "Nome do Usuário", //what is shown to user as column name
                sortKey: "name",
                filterOpt: {
                    //the types available are in type Column
                    type: "text",
                    placeholder: "Encontrar usuário...",
                    filterText: activedFilters.name,
                    onChange: (value) => onChangeText(UserUtil.NAME_KEY, value),
                },
                bodyCell: (user) => user.name, //the place for the actual value from Database of the specified user
            },
            {
                id: "email",
                headerCell: "E-mail",
                sortKey: "email",
                filterOpt: {
                    type: "text",
                    placeholder: "Encontrar e-mail...",
                    filterText: activedFilters.email,
                    onChange: (value) => onChangeText(UserUtil.EMAIL_KEY, value),
                },
                bodyCell: (user) => user.email,
            },
            {
                id: "userRoles",
                headerCell: "Papéis do Usuário",
                bodyCell: (user) => <Span.Roles userRoles={user.userRoles} />,
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.role,
                    onChange: (value) => onChangeText(UserUtil.ROLE_KEY, value),
                    enums: Object.values(Role).map((role) => ({
                        value: role,
                        label: UserRoleUtil.getRoleDescription(role),
                    })),
                },
            },
            {
                id: "bloqueado",
                headerCell: "Bloqueado?",
                bodyCell: (user) => (user.bloqueado ? "Bloqueado" : "Liberado"),
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.bloqueado?.toString(),
                    onChange: (value) => onChangeText(UserUtil.BLOCKED_KEY, value?.toString()),
                    enums: Object.values(Bloqueado).map((bloqueado) => ({
                        value: bloqueado,
                        label: bloqueado === Bloqueado.TRUE ? "Bloqueado" : "Liberado",
                    })),
                },
            },
            {
                id: "updatedAt",
                sortKey: "updatedAt",
                headerCell: "Última Atualização",
                filterOpt: {
                    type: "date",
                    filterDatesStr: activedFilters.updatedAt,
                    onChange: (value) => onChangeDate(UserUtil.UPDATED_AT_KEY, value),
                },
                bodyCell: (user) =>
                    user.updatedAt.toLocaleDateString("pt-Br", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
            },
        ];
    }, [activedFilters, onChangeDate, onChangeText]);
}
