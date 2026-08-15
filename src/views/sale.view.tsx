import useSaleColumns from "../hooks/table-columns/use-sale-columns";
import useOnChangeFilter from "../hooks/use-onchange-filter";
import TableConstructor from "../ui/table/constructor";
import useUserRole from "../hooks/use-user-role";
import useCustomer from "../hooks/use-customer";
import useContract from "../hooks/use-contract";
import SaleUtil from "../utils/sale.util";
import useSale from "../hooks/use-sale";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BotaoAdicionarDado, ModalAuditoriaVenda } from "../components";
import { OffcanvasForm } from "../components/offcanvas-form";
import { ActionTable, SortTable } from "../ui/table/type";
import { ContextUser } from "../contexts/ContextUser";
import { useSearchParams } from "react-router-dom";
import { Dropdown } from "../components/dropdowns";
import { Sale, SaleStatus } from "../types/sale";
import { LayoutTable } from "../layouts/table";
import { UserRole } from "../types/user-role";
import { Customer } from "../types/customer";
import { Contract } from "../types/contract";
import { Role } from "../types/commom";

import * as FilterButtons from "../components/botoes/filters";

export default function Sales() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { onClearFilters, onChangeText } = useOnChangeFilter();

    const { findManySales, cancelFindManySales, findingSales } = useSale();
    const { findManyCustomers, cancelFindManyCustomers } = useCustomer();
    const { findManyContracts, cancelFindManyContracts } = useContract();
    const { findUsersRole, cancelFindUsersRole } = useUserRole();

    const { canAddSale, currentUserRole, canReadUserRoles, canReadSale, canUpdateSale, canDeleteSale } =
        useContext(ContextUser);

    const [sales, setSales] = useState<Sale[]>([]);
    const [sortMode, setSortMode] = useState<SortTable<Sale> | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [salePeople, setSalePeople] = useState<UserRole[]>([]);
    const [managers, setManagers] = useState<UserRole[]>([]);
    const [architects, setArchitects] = useState<UserRole[]>([]);
    const [assistants, setAssistants] = useState<UserRole[]>([]);
    const [referrers, setReferrers] = useState<UserRole[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);

    const [selectedSales, setSelectedSales] = useState<Sale[]>([]);
    const [saleUpdating, setSaleUpdating] = useState<Sale | null>(null);
    const [saleDeleting, setSaleDeleting] = useState<Sale | null>(null);
    const [saleAuditing, setSaleAuditing] = useState<Sale | null>(null);
    const [saleCloning, setSaleCloning] = useState<Sale | null>(null);
    const [saleView, setSaleView] = useState<Sale | null>(null);
    const [showAddSale, setShowAddSale] = useState(false);

    const canAddSales =
        canAddSale({
            accountManagerId: currentUserRole?.id ?? "",
            estadoVenda: SaleStatus.INITIAL,
        }) ||
        canAddSale({
            insideSalesId: currentUserRole?.id ?? "",
            estadoVenda: SaleStatus.INITIAL,
        });
    const activedFilters = useMemo(() => SaleUtil.getFilterValuesBy(searchParams), [searchParams]);
    const activedFiltersCount = Object.values(activedFilters).filter((v) => v).length;

    const auxData = new Date();
    const year = auxData.getFullYear();
    const nextMonth = auxData.getMonth();
    const initialDate = new Date(year, nextMonth).toISOString();
    const lastDate = new Date(year, nextMonth + 1).toISOString();
    const initialFilterValues = new URLSearchParams({
        gte_dataVenda: initialDate,
        lte_dataVenda: lastDate,
    });

    // Set initial filter only on first render if not already set by user
    useEffect(() => {
        if (!searchParams.has(SaleUtil.GTE_SALE_DATE_KEY)) {
            const defaultSearchParams = new URLSearchParams(searchParams);
            initialFilterValues.forEach((value, key) => {
                if (!defaultSearchParams.has(key)) {
                    defaultSearchParams.set(key, value);
                }
            });
            setSearchParams(defaultSearchParams);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadSales = useCallback(() => {
        const where = SaleUtil.getWhereParamsBy(searchParams);
        if (!canReadSale(where)) return;
        findManySales({
            page: currentPage,
            limit: SaleUtil.DEFAULT_LIMIT_PER_PAGE,
            where,
            sortBy: sortMode?.by,
            sortType: sortMode?.type,
        })
            .then(setSales)
            .catch((err) => console.error(err));
    }, [findManySales, searchParams, currentPage, sortMode, canReadSale]);

    useEffect(() => {
        if (canReadSale({}) || !currentUserRole) return;

        const editableSearchParams = new URLSearchParams(searchParams);

        switch (currentUserRole.role) {
            case Role.VENDEDOR:
                editableSearchParams.set(SaleUtil.SALE_PERSON_ID_KEY, currentUserRole.id);
                break;
            case Role.COMERCIAL_ASSISTANT:
                editableSearchParams.set(SaleUtil.COMERCIAL_ASSISTANT_ROLE_ID_KEY, currentUserRole.id);
                break;
            case Role.SOLUTION_ARCHITECT:
                editableSearchParams.set(SaleUtil.SOLUTION_ARCHITECT_ROLE_ID_KEY, currentUserRole.id);
                break;
            case Role.REFERRER:
                editableSearchParams.set(SaleUtil.REFERRER_ROLE_ID_KEY, currentUserRole.id);
                break;
            default:
                break;
        }
        setSearchParams(editableSearchParams);
    }, [searchParams, setSearchParams, currentUserRole, canReadSale]);

    useEffect(() => {
        loadSales();
        return () => cancelFindManySales();
    }, [cancelFindManySales, loadSales]);

    useEffect(() => {
        findManyCustomers().then(setCustomers).catch(console.error);
        findManyContracts().then(setContracts).catch(console.error);

        findUsersRole({ where: { role: Role.VENDEDOR } })
            .then(setSalePeople)
            .catch(console.error);

        findUsersRole({ where: { role: Role.COMERCIAL_MANAGER } })
            .then(setManagers)
            .catch(console.error);

        findUsersRole({ where: { role: Role.SOLUTION_ARCHITECT } })
            .then(setArchitects)
            .catch(console.error);

        findUsersRole({ where: { role: Role.COMERCIAL_ASSISTANT } })
            .then(setAssistants)
            .catch(console.error);

        findUsersRole({ where: { role: Role.REFERRER } })
            .then(setReferrers)
            .catch(console.error);

        return () => {
            cancelFindManyContracts();
            cancelFindManyCustomers();
            cancelFindUsersRole();
        };
    }, [
        findManyCustomers,
        findManyContracts,
        findUsersRole,
        currentUserRole,
        canReadUserRoles,
        cancelFindManyContracts,
        cancelFindManyCustomers,
        cancelFindUsersRole,
    ]);

    const handleOnClickAdd = useCallback(() => setShowAddSale(true), []);

    // Para o botão de filtros do estado de venda
    const selectedFilterFromParams = searchParams.get("status") as SaleStatus | undefined;
    const handleSaleStatusFilterChange = (selected?: SaleStatus) => {
        onChangeText("status", selected);
    };

    const saleTableActions = useMemo(
        (): ((sale: Sale) => ActionTable[]) => (sale) => {
            const someCurrentSaleParams = {
                insideSalesIdAtual: sale.insideSalesId ?? "",
                accountManagerIdAtual: sale.accountManagerId ?? "",
                estadoVendaAtual: sale.estadoVenda,
            };

            const canUpdateThisSale = canUpdateSale({ ...someCurrentSaleParams, estadoVenda: sale.estadoVenda });
            const canDeleteThisSale = canDeleteSale(someCurrentSaleParams);

            return [
                { actionDescription: "Auditar", action: () => setSaleAuditing(sale) },
                { actionDescription: "Visualizar", action: () => setSaleView(sale) },
                canUpdateThisSale && { actionDescription: "Editar", action: () => setSaleUpdating(sale) },
                { actionDescription: "Clonar", action: () => setSaleCloning(sale) },
                canDeleteThisSale && { actionDescription: "Deletar", action: () => setSaleDeleting(sale) },
            ].filter((action) => action !== false);
        },
        [canUpdateSale, canDeleteSale]
    );

    return (
        <>
            <LayoutTable.Root>
                <LayoutTable.Header className="justify-content-between">
                    <div className="d-flex gap-2 justify-content-between">
                        {activedFiltersCount !== 0 && (
                            <FilterButtons.ClearFilters activedFilters={activedFiltersCount} onClick={onClearFilters} />
                        )}

                        {/* Botão para definir filtros pré-selecionados de acordo com o estado de venda */}
                        <FilterButtons.SetFilters
                            activedFilters={selectedFilterFromParams ? 1 : 0}
                            selectedFilter={selectedFilterFromParams}
                            onFilterChange={handleSaleStatusFilterChange}
                        />
                    </div>
                    {canAddSales && (
                        <BotaoAdicionarDado texto="Venda" onClickAdd={handleOnClickAdd} data-test="btn-group-add" />
                    )}
                </LayoutTable.Header>
                <LayoutTable.Body>
                    {sales.some((sale) =>
                        canDeleteSale({
                            accountManagerIdAtual: sale.accountManagerId ?? "",
                            insideSalesIdAtual: sale.insideSalesId ?? "",
                            estadoVendaAtual: sale.estadoVenda,
                        })
                    ) && (
                        <>
                            <div className="d-flex gap-2">
                                <Dropdown.SaleClientReports
                                    sales={sales}
                                    selectedSalesIds={selectedSales.map(({ id }) => id)}
                                />
                                <Dropdown.SaleUserReports
                                    sales={sales}
                                    selectedSalesIds={selectedSales.map(({ id }) => id)}
                                />
                            </div>
                        </>
                    )}
                    <TableConstructor
                        columns={useSaleColumns({
                            customers,
                            salePeople,
                            contracts,
                            managers,
                            architects,
                            assistants,
                            referrers,
                        })}
                        data={sales}
                        tableName="Vendas"
                        onChangeCurrentPage={setCurrentPage}
                        onChangeSortModeColumn={setSortMode}
                        selection={useMemo(() => ({ dataId: "id" as keyof Sale, onSelect: setSelectedSales }), [])}
                        actions={saleTableActions}
                        processing={findingSales}
                        selectedSaleStatus={selectedFilterFromParams}
                    />
                </LayoutTable.Body>
            </LayoutTable.Root>

            <OffcanvasForm.Sale.ManageSale
                show={!showAddSale && (!!saleUpdating || !!saleCloning)}
                saleUpdating={saleUpdating}
                saleCloning={saleCloning}
                onDone={() => {
                    setSaleUpdating(null);
                    setSaleCloning(null);
                    loadSales();
                }}
                onHide={() => {
                    setSaleUpdating(null);
                    setSaleCloning(null);
                }}
            />

            <OffcanvasForm.Sale.ManageNewSale
                show={showAddSale && !saleUpdating && !saleCloning}
                onDone={() => {
                    setSaleUpdating(null);
                    setSaleCloning(null);
                }}
                onHide={() => {
                    setSaleUpdating(null);
                    setSaleCloning(null);
                    setShowAddSale(false);
                }}
            />

            <OffcanvasForm.Sale.Delete
                saleToDelete={saleDeleting}
                onDone={() => {
                    setSaleDeleting(null);
                    loadSales();
                }}
                onHide={() => setSaleDeleting(null)}
            />

            <OffcanvasForm.Sale.ViewSale
                show={!!saleView}
                saleUpdating={saleView}
                onDone={() => {
                    setSaleView(null);
                }}
                onHide={() => {
                    setSaleView(null);
                }}
            />

            <ModalAuditoriaVenda
                venda={saleAuditing}
                show={saleAuditing !== null}
                onHide={() => setSaleAuditing(null)}
            />
        </>
    );
}
