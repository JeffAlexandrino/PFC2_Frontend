import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BotaoAdicionarDado, ModalAuditoriaVisita } from "../components";
import { ActionTable, Column, SortTable } from "../ui/table/type";
import { ContextAlerta } from "../contexts/ContextAlert";
import { ContextUser } from "../contexts/ContextUser";
import { useSearchParams } from "react-router-dom";
import { Dropdown } from "../components/dropdowns";
import { LayoutTable } from "../layouts/table";
import { UserRole } from "../types/user-role";
import { Customer } from "../types/customer";
import { Visit } from "../types/visits";
import { Role } from "../types/commom";

import OffcanvasVisitaCreate from "../components/offcanvas/OffcanvasVisitaCreate";
import OffcanvasVisitaEdit from "../components/offcanvas/OffcanvasVisitaEdit";
import useOnChangeFilter from "../hooks/use-onchange-filter";
import TableConstructor from "../ui/table/constructor";
import UserRoleUtil from "../utils/user-role.util";
import useUserRole from "../hooks/use-user-role";
import useCustomer from "../hooks/use-customer";
import VisitUtil from "../utils/visit.util";
import useVisit from "../hooks/use-visit";
import utils from "../utils";

import * as FilterButtons from "../components/botoes/filters";
import * as Span from "../components/span";

export default function Visits() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { onChangeDate, onChangeText, onClearFilters } = useOnChangeFilter();

    const { findManyVisits, cancelFindManyVisits, findingVisits, payVisits } = useVisit();
    const { findUsersRole: findManyUsersRole, cancelFindUsersRole: cancelFindManyUsersRole } = useUserRole();
    const { findManyCustomers, cancelFindManyCustomers } = useCustomer();

    const {
        canAddVisit,
        currentUserRole,
        canReadUserRoles: podeVisualizarUserRoles,
        canReadVisit,
        canEditVisit,
        canDeleteVisit,
    } = useContext(ContextUser);
    const { setConfirmar, setProcessando } = useContext(ContextAlerta);

    const [visits, setVisits] = useState<Visit[]>([]);
    const [selectedVisits, setSelectedVisits] = useState<Visit[]>([]);
    const [salePersonRoles, setSalePersonRoles] = useState<UserRole[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [sortMode, setSortMode] = useState<SortTable<Visit> | null>(null);

    const [visitToUpdate, setVisitToUpdate] = useState<Visit | null>(null);
    const [visitToDelete, setVisitToDelete] = useState<Visit | null>(null);
    const [visitToAudit, setVisitToAudit] = useState<Visit | null>(null);
    const [showAddVisit, setShowAddVisit] = useState(false);

    const canAddVisits = canAddVisit({ salePersonId: currentUserRole?.id });
    const isAdminOrManager = currentUserRole?.role === Role.ADMIN || currentUserRole?.role === Role.COMERCIAL_MANAGER;
    const onlyComercialNotManagerRoles = UserRoleUtil.hasOnlyComercialNotManagerRoles([
        currentUserRole?.role ?? Role.VENDEDOR,
    ]);
    const activedFilters = useMemo(() => VisitUtil.getFilterValuesBy(searchParams), [searchParams]);
    const activedFiltersCount = Object.values(activedFilters).filter((v) => v).length;

    const auxData = new Date();
    const year = auxData.getFullYear();
    const nextMonth = auxData.getMonth();
    const initialDate = new Date(year, nextMonth).toISOString();
    const lastDate = new Date(year, nextMonth + 1).toISOString();
    const initialFilterValues = new URLSearchParams({
        gte_dataVisita: initialDate,
        lte_dataVisita: lastDate,
    });

    // Set initial filter only on first render if not already set by user
    useEffect(() => {
        if (!searchParams.has(VisitUtil.LTE_VISIT_DATE_KEY)) {
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

    const loadVisits = useCallback(() => {
        const where = VisitUtil.getWhereParamsBy(searchParams);
        if (!canReadVisit(where)) return;

        findManyVisits({
            limit: VisitUtil.DEFAULT_LIMIT_PER_PAGE,
            page: currentPage,
            where,
            sortBy: sortMode?.by,
            sortType: sortMode?.type,
        })
            .then(setVisits)
            .catch((err) => console.error(err));
    }, [searchParams, currentPage, findManyVisits, sortMode, canReadVisit]);

    useEffect(() => {
        if (canReadVisit({}) || !currentUserRole) return;

        const editableSearchParams = new URLSearchParams(searchParams);
        editableSearchParams.set(VisitUtil.SALE_PERSON_ROLE_ID_KEY, currentUserRole.id);

        setSearchParams(editableSearchParams);
    }, [searchParams, setSearchParams, currentUserRole, canReadVisit]);

    useEffect(() => {
        findManyCustomers()
            .then((customers) => setCustomers(customers))
            .catch((err) => console.error(err));

        const whereWithoutId = { role: Role.VENDEDOR };
        const whereWithId = { ...whereWithoutId, id: currentUserRole?.id };
        findManyUsersRole({ where: podeVisualizarUserRoles(whereWithoutId) ? whereWithoutId : whereWithId })
            .then((salePersonRole) => setSalePersonRoles(salePersonRole))
            .catch((err) => console.error(err));

        return () => {
            cancelFindManyUsersRole();
            cancelFindManyCustomers();
        };
    }, [
        cancelFindManyUsersRole,
        findManyUsersRole,
        findManyCustomers,
        cancelFindManyCustomers,
        currentUserRole,
        podeVisualizarUserRoles,
    ]);

    useEffect(() => {
        loadVisits();
        return () => cancelFindManyVisits();
    }, [cancelFindManyVisits, loadVisits]);

    const handleOnCheckAsPaid = useCallback(
        async (visita: Visit) => {
            const confirm = await setConfirmar(
                "Após esta saída ser marcada como paga, não será possível reverter o estado."
            );
            if (!confirm) return;

            try {
                setProcessando(true);
                await payVisits([visita.id]);
                loadVisits();
            } catch (err) {
                console.error(err);
            } finally {
                setProcessando(false);
            }
        },
        [payVisits, loadVisits, setProcessando, setConfirmar]
    );

    const visitTableActions = useMemo(
        (): ((visit: Visit) => ActionTable[]) => (visit) => {
            const auditAction = { actionDescription: "Auditar", action: () => setVisitToAudit(visit) };
            if (visit.visitaPaga) return [auditAction];

            const canUpdateVisit = canEditVisit({
                salePersonId: visit.salePersonId,
                currentSalePersonId: visit.salePersonId,
            });
            const canEraseVisit = isAdminOrManager && canDeleteVisit({ currentSalePersonId: visit.salePersonId });
            const canPayVisit = canEditVisit({ visitaPaga: true });
            return [
                auditAction,
                canPayVisit && { actionDescription: "Marcar como paga", action: () => handleOnCheckAsPaid(visit) },
                canUpdateVisit && { actionDescription: "Editar", action: () => setVisitToUpdate(visit) },
                canEraseVisit && { actionDescription: "Deletar", action: () => setVisitToDelete(visit) },
            ].filter((action) => action !== false);
        },
        [handleOnCheckAsPaid, canEditVisit, canDeleteVisit, isAdminOrManager]
    );

    const visitTableColumns = useMemo((): Column<Visit>[] => {
        return [
            {
                id: "visitaPaga",
                headerCell: "Saída Paga",
                sortKey: "visitaPaga",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.filterPaidStatus,
                    onChange: (filterValue) => onChangeText(VisitUtil.PAID_STATUS_KEY, filterValue),
                    enums: [
                        { value: "true", label: "Sim" },
                        { value: "false", label: "Não" },
                    ],
                },
                bodyCell: (visit) => (visit.visitaPaga ? "Sim" : "Não"),
            },
            {
                id: "dataVisita",
                headerCell: "Data da saída",
                sortKey: "dataVisita",
                filterOpt: {
                    type: "date",
                    filterDatesStr: activedFilters.filterVisitDate,
                    onChange: (filterDateStr) => onChangeDate(VisitUtil.VISIT_DATE_KEY, filterDateStr),
                },
                bodyCell: (visit) =>
                    visit.dataVisita.toLocaleDateString("pt-Br", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
            },
            {
                id: "tipoVisita",
                headerCell: "Tipo de visita",
                sortKey: "tipoVisita",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.filterTipoVisita,
                    onChange: (filterValue) => onChangeText(VisitUtil.TIPO_VISITA_KEY, filterValue),
                    enums: [
                        { label: "Visita", value: "VISITA" },
                        { label: "Reunião", value: "REUNIAO" },
                        { label: "Suporte", value: "SUPORTE" },
                        { label: "Treinamento", value: "TREINAMENTO" },
                        { label: "Webinar", value: "WEBINAR" },
                        { label: "Workshop", value: "WORKSHOP" },
                    ],
                },
                bodyCell: (visit) => utils.returnTextTipoVisita(visit.tipoVisita),
            },
            {
                id: "vendedorRoleId",
                headerCell: "Vendedor",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.filterSalePersonId,
                    onChange: (filterValue) => onChangeText(VisitUtil.SALE_PERSON_ROLE_ID_KEY, filterValue),
                    enums: salePersonRoles.map(({ user, id }) => ({ value: id, label: user.name })),
                },
                bodyCell: (visit) => visit.salePerson.user.name,
            },
            {
                id: "clienteId",
                headerCell: "Cliente",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.filterCustomerId,
                    onChange: (filterValue) => onChangeText(VisitUtil.CUSTOMER_ID_KEY, filterValue),
                    enums: customers.map(({ name, id }) => ({ value: id, label: name })),
                },
                bodyCell: (visit) => visit.cliente.name,
            },
            {
                id: "remoto",
                headerCell: "Saída Remota",
                sortKey: "remoto",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.filterRemote,
                    onChange: (filterValue) => onChangeText(VisitUtil.REMOTE_KEY, filterValue),
                    enums: [
                        { label: "Sim", value: "true" },
                        { label: "Não", value: "false" },
                    ],
                },
                bodyCell: (visit) => (visit.remoto ? "Sim" : "Não"),
            },
            {
                id: "carroEmpresa",
                headerCell: "Carro da Empresa",
                sortKey: "carroEmpresa",
                filterOpt: {
                    filterValue: activedFilters.filterOrganizationCar,
                    onChange: (filterValue) => onChangeText(VisitUtil.ORGANIZATION_CAR_KEY, filterValue),
                    type: "enum",
                    enums: [
                        { label: "Sim", value: "true" },
                        { label: "Não", value: "false" },
                    ],
                },
                bodyCell: (visit) => (visit.carroEmpresa ? "Sim" : "Não"),
            },
            {
                id: "comentarios",
                headerCell: "Comentário",
                filterOpt: {
                    type: "text",
                    placeholder: "Encontrar comentário...",
                    filterText: activedFilters.filterComments,
                    onChange: (filterValue) => onChangeText(VisitUtil.COMMENTS_KEY, filterValue),
                },
                bodyCell: (visit) => <Span.Coment coments={visit.comentarios} />,
            },
            {
                id: "kmInicial",
                headerCell: "Kilometragem",
                bodyCell: (visit) => <Span.VisitKm visita={visit} />,
            },
            {
                id: "gastos",
                headerCell: "Notas e Gastos",
                filterOpt: {
                    type: "text",
                    placeholder: "Encontrar nota...",
                    filterText: activedFilters.filterInvoiceCode,
                    onChange: (filterValue) => onChangeText(VisitUtil.INVOICE_CODE_KEY, filterValue),
                },
                bodyCell: (visit) => <Span.VisitSpent visita={visit} />,
            },
            {
                id: "updatedAt",
                headerCell: "Última Atualização",
                sortKey: "updatedAt",
                filterOpt: {
                    type: "date",
                    filterDatesStr: activedFilters.filterUpdatedAt,
                    onChange: (filterDateStr) => onChangeDate(VisitUtil.UPDATED_AT_KEY, filterDateStr),
                },
                bodyCell: (visit) =>
                    visit.updatedAt.toLocaleDateString("pt-Br", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
            },
        ];
    }, [salePersonRoles, customers, onChangeDate, onChangeText, activedFilters]);

    return (
        <>
            <LayoutTable.Root>
                <LayoutTable.Header className="justify-content-between">
                    <div className="d-flex gap-2">
                        {activedFiltersCount !== 0 && (
                            <FilterButtons.ClearFilters activedFilters={activedFiltersCount} onClick={onClearFilters} />
                        )}
                    </div>
                    {canAddVisits && <BotaoAdicionarDado texto="Saída" onClickAdd={() => setShowAddVisit(true)} />}
                </LayoutTable.Header>
                <LayoutTable.Body>
                    <div className="d-flex gap-2">
                        <div className={selectedVisits.length > 0 ? "d-none" : ""}>
                            <Dropdown.VisitPendingPayments
                                salePersonRoles={salePersonRoles}
                                onDone={loadVisits}
                                userRoleCanSee={onlyComercialNotManagerRoles}
                            />
                        </div>
                        <Dropdown.VisitReports
                            selectedVisitsIds={selectedVisits.map(({ id }) => id)}
                            salePersonRoles={salePersonRoles}
                            userRoleCanSee={onlyComercialNotManagerRoles}
                        />
                    </div>
                    <TableConstructor
                        tableName="Saídas"
                        columns={visitTableColumns}
                        data={visits}
                        actions={visitTableActions}
                        onChangeCurrentPage={setCurrentPage}
                        onChangeSortModeColumn={setSortMode}
                        selection={useMemo(() => ({ dataId: "id" as keyof Visit, onSelect: setSelectedVisits }), [])}
                        processing={findingVisits}
                    />
                </LayoutTable.Body>
            </LayoutTable.Root>

            <OffcanvasVisitaCreate
                mostrarForm={showAddVisit}
                onCancel={() => {
                    setShowAddVisit(false);
                }}
                onTerminou={loadVisits}
            />

            <OffcanvasVisitaEdit
                tipo="editar"
                mostrarForm={visitToUpdate !== null}
                dados={visitToUpdate}
                onCancel={() => {
                    setVisitToUpdate(null);
                }}
                onTerminou={() => {
                    setVisitToUpdate(null);
                }}
            />

            <OffcanvasVisitaEdit
                tipo="deletar"
                mostrarForm={visitToDelete !== null}
                dados={visitToDelete}
                onCancel={() => {
                    setVisitToDelete(null);
                }}
                onTerminou={() => {
                    setVisitToDelete(null);
                }}
            />

            <ModalAuditoriaVisita
                visita={visitToAudit}
                show={visitToAudit !== null}
                onHide={() => setVisitToAudit(null)}
            />
        </>
    );
}
