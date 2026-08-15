import { useCallback, useContext, useEffect, useMemo } from "react";
import { ContextUser } from "../contexts/ContextUser";
import { useSearchParams } from "react-router-dom";
import { SaleStatus } from "../types/sale";
import { Role } from "../types/commom";

import UserRoleUtil from "../utils/user-role.util";
import utils from "../utils";

export enum FilterKey {
    SALE_STATUS = "estadoVenda",
    INITIAL_MONTH = "mesInicial",
    END_MONTH = "mesFinal",
    USER_ROLE = "userRoleId",
    ROLE = "role",
    YEAR = "ano",
}

export default function useFiltros() {
    //HOOKS
    const { currentUserRole, canReadUserRoles: podeVisualizarUserRoles } = useContext(ContextUser);
    const [searchParams, setSearchParams] = useSearchParams();

    //VARIABLES
    const userRoleId = currentUserRole?.id;
    const role = currentUserRole?.role;
    const userWithComercialRole = currentUserRole && UserRoleUtil.isComercialRole(currentUserRole.role);

    const _initialMonthSelected = searchParams.get(FilterKey.INITIAL_MONTH); //Gets the selected url params
    const firstMonthIfNoneSelected = Number(_initialMonthSelected ?? 0); //If none is inserted, then select the first month

    const _endMonthSelected = searchParams.get(FilterKey.END_MONTH);
    const lastMonthIfNoneSelected = Number(_endMonthSelected ?? 11);

    const _saleStatusSelected = searchParams.get(FilterKey.SALE_STATUS) ?? undefined;
    const saleStatusSelected = Object.values(SaleStatus).find((status) => _saleStatusSelected === status);

    const yearSelected = searchParams.get(FilterKey.YEAR) ?? undefined;

    const userRoleIdSelected = searchParams.get(FilterKey.USER_ROLE) ?? undefined;
    const _roleSelected = searchParams.get(FilterKey.ROLE) ?? undefined;
    const roleSelected = Object.values(Role).find((role) => _roleSelected === role);

    const { dataInicial: dataInicialSelecionada, dataFinal: dataFinalSelecionada } = useMemo(() => {
        return utils.datasPorMesesAno(_initialMonthSelected, _endMonthSelected, yearSelected);
    }, [_initialMonthSelected, _endMonthSelected, yearSelected]);

    const removeFilter = useCallback(
        (type: FilterKey) => {
            const currentParams = searchParams;
            currentParams.delete(type);
            setSearchParams(currentParams);
        },
        [setSearchParams, searchParams]
    );

    const setFilter = useCallback(
        (type: FilterKey, value: string) => {
            const currentParams = searchParams;
            removeFilter(type);
            currentParams.append(type, value);
            setSearchParams(currentParams, { replace: true });
        },
        [setSearchParams, searchParams, removeFilter]
    );

    //EVENTOS
    useEffect(() => {
        const dataAtual = new Date();
        const anoAtual = dataAtual.getFullYear().toString();

        const currentParams = new URLSearchParams();

        const filterKeys = Object.values(FilterKey);

        filterKeys.forEach((filterKey) => {
            const filterValue = searchParams.get(filterKey);

            switch (filterKey) {
                case FilterKey.YEAR:
                    return currentParams.set(filterKey, filterValue ?? anoAtual);
                case FilterKey.INITIAL_MONTH:
                    return currentParams.set(filterKey, filterValue ?? "0");
                case FilterKey.END_MONTH:
                    return currentParams.set(filterKey, filterValue ?? "11");
                case FilterKey.USER_ROLE:
                    //if (podeVisualizarUserRoles({ role }) && userRoleId)
                    //    return currentParams.set(filterKey, filterValue ?? userRoleId);
                    //else if (filterValue) return currentParams.set(filterKey, filterValue);
                    break;
                case FilterKey.ROLE:
                    if (!podeVisualizarUserRoles({ role }) && role) return currentParams.set(filterKey, role);
                    else return currentParams.set(filterKey, filterValue ?? Role.VENDEDOR);
                default:
                    if (filterValue) return currentParams.set(filterKey, filterValue);
                    break;
            }
        });

        //setSearchParams(currentParams);
    }, [setSearchParams, userRoleId, userWithComercialRole, searchParams, role, podeVisualizarUserRoles]);

    return {
        setFilter,
        removeFilter,
        dataInicialSelecionada,
        dataFinalSelecionada,
        mesInicialSelecionado: firstMonthIfNoneSelected, //Pass the first month
        mesFinalSelecionado: lastMonthIfNoneSelected,
        anoSelecionado: yearSelected,
        estadoVendaSelecionado: saleStatusSelected,
        userRoleIdSelected: userRoleIdSelected,
        roleSelected,
    };
}
