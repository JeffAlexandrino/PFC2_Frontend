import useCommissionColumns from "../hooks/table-columns/use-commission-columns";
import useOnChangeFilter from "../hooks/use-onchange-filter";
import TableConstructor from "../ui/table/constructor";
import CommissionUtil from "../utils/commission.util";
import useCommission from "../hooks/use-commission";
//import UserRoleUtil from "../utils/user-role.util";
import useCustomer from "../hooks/use-customer";
import Modal from "../components/modals";
import useUser from "../hooks/use-user";
import cn from "../utils/cn";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CommissionReports, ModalAuditoriaComissao } from "../components";
import { Dropdown as CDropdown } from "../components/dropdowns";
import { OffcanvasForm } from "../components/offcanvas-form";
import { ActionTable, SortTable } from "../ui/table/type";
import { ContextAlerta } from "../contexts/ContextAlert";
import { ContextUser } from "../contexts/ContextUser";
import { Offcanvas } from "../components/offcanvas";
import { useSearchParams } from "react-router-dom";
import { Commission } from "../types/commission";
import { LayoutTable } from "../layouts/table";
import { Customer } from "../types/customer";
import { SaleStatus } from "../types/sale";
import { Role } from "../types/commom";
import { User } from "../types/user";

import * as FilterButtons from "../components/botoes/filters";

export default function Commissions() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { onClearFilters } = useOnChangeFilter();

    const { canReadUser: podeVisualizarUser, usuario } = useContext(ContextUser);
    const { canReadCommission, canEditCommission } = useContext(ContextUser);
    const { setProcessando, setConfirmar } = useContext(ContextAlerta);

    const { findManyCommissions, cancelFindManyCommissions, updateCommission, findingCommissions } = useCommission();
    const { approveManyCommissions } = useCommission();

    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [selectedCommissions, setSelectedCommissions] = useState<Commission[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortMode, setSortMode] = useState<SortTable<Commission> | null>(null);

    const { findManyCustomers, cancelFindManyCustomers } = useCustomer();
    const { findManyUsers, cancelFindManyUsers } = useUser();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [commissionTogglingDistributorPaid, setCommissionTogglingDistributorPaid] = useState<Commission | null>(null);
    const [commissionToDelete, setCommissionToDelete] = useState<Commission | null>(null);
    const [commissionToAudit, setCommissionToAudit] = useState<Commission | null>(null);
    const [showDistributions, setShowDistributions] = useState<Role | null>(null);

    const auxData = new Date();
    const year = auxData.getFullYear();
    const nextMonth = auxData.getMonth();
    const initialDate = new Date(year, nextMonth).toISOString();
    const lastDate = new Date(year, nextMonth + 1).toISOString();
    const initialFilterValues = new URLSearchParams({
        //comissaoPaga: "false",
        distributorPaid: "true",
        estadoVenda: "AVAILABLE_PAYMENT",
        gte_dataComissao: initialDate,
        lte_dataComissao: lastDate,
    });

    // Set initial filter only on first render if not already set by user
    useEffect(() => {
        if (!searchParams.has(CommissionUtil.PAID_STATUS_KEY)) {
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

    const activedFilters = useMemo(() => CommissionUtil.getFilterValuesBy(searchParams), [searchParams]);
    const activedFiltersCount = Object.values(activedFilters).filter((v) => v).length;

    const loadCommissions = useCallback(() => {
        const where = CommissionUtil.getWhereParamsBy(searchParams);
        if (!canReadCommission(where)) return;

        findManyCommissions({
            limit: CommissionUtil.DEFAULT_LIMIT_PER_PAGE,
            page: currentPage,
            sortBy: sortMode?.by,
            sortType: sortMode?.type,
            where,
        })
            .then(setCommissions)
            .catch(console.error);
    }, [searchParams, currentPage, sortMode, findManyCommissions, canReadCommission]);

    useEffect(() => {
        if (canReadCommission({}) || !usuario) return;

        const editableSearchParams = new URLSearchParams(searchParams);
        editableSearchParams.set(CommissionUtil.USER_ID_KEY, usuario.id);
        setSearchParams(editableSearchParams);
    }, [searchParams, setSearchParams, canReadCommission, usuario]);

    useEffect(() => {
        loadCommissions();
        return () => cancelFindManyCommissions();
    }, [cancelFindManyCommissions, loadCommissions]);

    useEffect(() => {
        findManyCustomers().then(setCustomers).catch(console.error);

        const canViewAllUsers = podeVisualizarUser({});
        findManyUsers({ where: canViewAllUsers ? undefined : { id: usuario?.id } })
            .then(setUsers)
            .catch(console.error);
        return () => {
            cancelFindManyCustomers();
            cancelFindManyUsers();
        };
    }, [cancelFindManyCustomers, podeVisualizarUser, cancelFindManyUsers, findManyCustomers, findManyUsers, usuario]);

    const checkAsAvailablePayment = useCallback(
        async (commission: Commission) => {
            const confirm = await setConfirmar(
                "Após esta comissão ter sido marcada como paga, não será possível reverter o estado."
            );
            if (!confirm) return;

            try {
                setProcessando(true);
                const updateData: any = { id: commission.id, comissaoPaga: !commission.comissaoPaga };
                if (commission.venda.estadoVenda === SaleStatus.AVAILABLE_PAYMENT) {
                    updateData.estadoVenda = SaleStatus.PAID;
                }
                await updateCommission(updateData);
                loadCommissions();
            } catch (err) {
                console.error(err);
            } finally {
                setProcessando(false);
            }
        },
        [updateCommission, loadCommissions, setConfirmar, setProcessando]
    );

    const approve = useCallback(
        async (commission: Commission) => {
            setProcessando(true);
            approveManyCommissions([commission.id])
                .then(loadCommissions)
                .catch(console.error)
                .finally(() => setProcessando(false));
        },
        [approveManyCommissions, loadCommissions, setProcessando]
    );

    //Check and show the actions if the user has the privilege
    const commissionTableActions = useMemo(
        (): ((commission: Commission) => ActionTable[]) => (commission) => {
            const auditAction = { actionDescription: "Auditar", action: () => setCommissionToAudit(commission) };
            const isStatusSaleAvailablePayment = commission.venda.estadoVenda === SaleStatus.AVAILABLE_PAYMENT;
            const canMarkDistributorPaid = canEditCommission({}) && isStatusSaleAvailablePayment;
            const canPayCommission =
                canEditCommission({ comissaoPaga: true }) &&
                isStatusSaleAvailablePayment &&
                commission.distributorPaid;

            return commission.comissaoPaga
                ? [auditAction]
                : [
                      auditAction,
                      canMarkDistributorPaid && {
                          actionDescription: `Marcar ${
                              commission.distributorPaid ? "não paga" : "paga"
                          } pelo distribuidor`,
                          action: () => setCommissionTogglingDistributorPaid(commission),
                      },
                      canPayCommission && {
                          actionDescription: "Aprovar",
                          action: () => approve(commission),
                      },
                      canPayCommission && {
                          actionDescription: "Marcar como paga",
                          action: () => checkAsAvailablePayment(commission),
                      },
                      canMarkDistributorPaid && {
                          actionDescription: "Desativar",
                          action: () => setCommissionToDelete(commission),
                      },
                  ].filter((action) => action !== false);
        },
        [checkAsAvailablePayment, canEditCommission, approve]
    );

    return (
        <>
            <LayoutTable.Root>
                <LayoutTable.Header className="justify-content-between">
                    <div className="d-flex gap-2">
                        {activedFiltersCount !== 0 && (
                            <FilterButtons.ClearFilters
                                onClick={onClearFilters}
                                activedFilters={activedFiltersCount}
                                data-test="clear-filters-button"
                            />
                        )}
                    </div>
                </LayoutTable.Header>
                <LayoutTable.Body>
                    <div className="d-flex gap-2">
                        <CDropdown.CommissionInfoPerRoles
                            className={cn([selectedCommissions.length > 0 && "d-none"])}
                            onDone={loadCommissions}
                        />
                        <CommissionReports
                            users={users}
                            selectedCommissionsIds={selectedCommissions.map(({ id }) => id)}
                            userRoleCanSee={canEditCommission({ comissaoPaga: true })}
                        />
                    </div>
                    <TableConstructor
                        tableName="Comissoes"
                        data={commissions}
                        actions={commissionTableActions}
                        columns={useCommissionColumns({ customers, users: users })}
                        selection={useMemo(
                            () => ({ dataId: "id" as keyof Commission, onSelect: setSelectedCommissions }),
                            []
                        )}
                        onChangeCurrentPage={setCurrentPage}
                        onChangeSortModeColumn={setSortMode}
                        processing={findingCommissions}
                    />
                </LayoutTable.Body>
            </LayoutTable.Root>

            <Offcanvas.CommissionDistributions
                show={!!showDistributions}
                onHide={() => setShowDistributions(null)}
                role={showDistributions || Role.VENDEDOR}
            />

            <ModalAuditoriaComissao
                show={commissionToAudit !== null}
                comissao={commissionToAudit}
                onHide={() => setCommissionToAudit(null)}
            />

            <Modal.ToggleCommissionDistributorPaid
                commission={commissionTogglingDistributorPaid}
                onCancel={() => setCommissionTogglingDistributorPaid(null)}
                onDone={() => {
                    setCommissionTogglingDistributorPaid(null);
                    loadCommissions();
                }}
            />

            <OffcanvasForm.Disable
                onHide={() => setCommissionToDelete(null)}
                commissionToDisable={commissionToDelete}
                onDone={() => {
                    setCommissionToDelete(null);
                    loadCommissions();
                }}
            />
        </>
    );
}
