import { BotaoAdicionarDado, OffcanvasCliente, ModalImportarClientes, ModalAuditoriaCliente } from "../components";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Customer, CustomerOriginOptions, getOriginDescription } from "../types/customer";
import { ActionTable, Column, SortTable } from "../ui/table/type";
import { ContextUser } from "../contexts/ContextUser";
import { useSearchParams } from "react-router-dom";
import { LayoutTable } from "../layouts/table";
import { Segment } from "../types/segment";

import useOnChangeFilter from "../hooks/use-onchange-filter";
import TableConstructor from "../ui/table/constructor";
import CustomerUtil from "../utils/customer.util";
import useCustomer from "../hooks/use-customer";
import StringUtil from "../utils/string.util";
import useSegment from "../hooks/use-segment";

import * as FilterButtons from "../components/botoes/filters";

export default function Customers() {
    const [searchParams] = useSearchParams();
    const { onChangeDate, onChangeText, onClearFilters } = useOnChangeFilter();
    const { canAddCustomer, canEditCustomer, canDeleteCustomer, currentUserRole } = useContext(ContextUser);

    const { findManySegments, cancelFindManySegments } = useSegment();
    const { findManyCustomers, cancelFindManyCustomers, importCustomers, cancelImportCustomers, findingCustomers } =
        useCustomer();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [segments, setSegments] = useState<Segment[]>([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [sortMode, setSortMode] = useState<SortTable<Customer> | null>(null);

    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [showImportCustomers, setShowImportCustomers] = useState(false);
    const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
    const [customerView, setCustomerView] = useState<Customer | null>(null);
    const [customerToAudit, setCustomerToAudit] = useState<Customer | null>(null);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

    const activedFilters = useMemo(() => CustomerUtil.getFilterValuesBy(searchParams), [searchParams]);
    const activedFiltersCount = Object.values(activedFilters).filter((v) => v).length;

    const loadCustomers = useCallback(() => {
        findManyCustomers({
            limit: CustomerUtil.DEFAULT_LIMIT_PER_PAGE,
            page: currentPage,
            sortBy: sortMode?.by,
            sortType: sortMode?.type,
            where: CustomerUtil.getWhereParamsBy(searchParams),
        })
            .then(setCustomers)
            .catch(console.error);
    }, [findManyCustomers, currentPage, sortMode, searchParams]);

    useEffect(() => {
        loadCustomers();
        return () => cancelFindManyCustomers();
    }, [loadCustomers, cancelFindManyCustomers]);

    useEffect(() => {
        findManySegments().then(setSegments).catch(console.error);
        return () => cancelFindManySegments();
    }, [findManySegments, cancelFindManySegments]);

    const customerTableActions = useMemo(() => {
        const getCustomerActions = (customer: Customer): ActionTable[] => {
            const canDeleteOrUpdate = canDeleteCustomer({});
            const canEdit = canEditCustomer({});

            const actions: ActionTable[] = [
                { actionDescription: "Auditar", action: () => setCustomerToAudit(customer) },
                { actionDescription: "Visualizar", action: () => setCustomerView(customer) },
            ];

            if (canEdit) {
                actions.push({ actionDescription: "Editar", action: () => setCustomerToEdit(customer) });
            }

            if (canDeleteOrUpdate) {
                actions.push({ actionDescription: "Deletar", action: () => setCustomerToDelete(customer) });
            }

            return actions;
        };

        return (customer: Customer) => getCustomerActions(customer);
    }, [canEditCustomer, canDeleteCustomer]);

    const customerTableColumns = useMemo((): Column<Customer>[] => {
        return [
            {
                id: "name",
                headerCell: "Nome do Cliente",
                sortKey: "name",
                filterOpt: {
                    type: "text",
                    placeholder: "Encontrar usuário...",
                    filterText: activedFilters.name,
                    onChange: (value) => onChangeText(CustomerUtil.NAME_KEY, value),
                },
                bodyCell: (customer) => customer.name,
            },
            {
                id: "origem",
                headerCell: "Origem",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.origem,
                    onChange: (value) => onChangeText(CustomerUtil.ORIGIN_KEY, value),
                    enums: CustomerOriginOptions,
                },
                bodyCell: (customer) => getOriginDescription(customer.origem),
            },
            {
                id: "email",
                headerCell: "E-mail",
                sortKey: "email",
                filterOpt: {
                    type: "text",
                    placeholder: "Encontrar e-mail...",
                    filterText: activedFilters.email,
                    onChange: (value) => onChangeText(CustomerUtil.EMAIL_KEY, value),
                },
                bodyCell: (customer) => customer.email,
            },
            {
                id: "cnpj",
                headerCell: "CNPJ",
                sortKey: "cnpj",
                filterOpt: {
                    type: "text",
                    placeholder: "Somente números Ex: 0224...",
                    filterText: activedFilters.cnpj,
                    onChange: (value) => onChangeText(CustomerUtil.CNPJ_KEY, value),
                },
                bodyCell: (customer) => StringUtil.getCNPJFormat(customer.cnpj),
            },
            {
                id: "telefone",
                headerCell: "Telefone",
                sortKey: "telefone",
                filterOpt: {
                    type: "text",
                    placeholder: "Somente números Ex: 48996...",
                    filterText: activedFilters.phone,
                    onChange: (value) => onChangeText(CustomerUtil.PHONE_KEY, value),
                },
                bodyCell: (customer) => StringUtil.getPhoneFormat(customer.telefone),
            },
            {
                id: "segmentoId",
                headerCell: "Segmento",
                bodyCell: (customer) => customer.segmento.name,
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.segmentId,
                    onChange: (value) => onChangeText(CustomerUtil.SEGMENT_ID_KEY, value),
                    enums: segments.map(({ name, id }) => ({ value: id, label: name })),
                },
            },
            {
                id: "responsavelId",
                headerCell: "Responsável",
                sortKey: "responsavelId",
                bodyCell: (customer) => customer.responsavel?.name || "-",
            },
            {
                id: "comprou",
                headerCell: "Já teve venda?",
                sortKey: "comprou",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.comprou,
                    onChange: (filterValue) => onChangeText(CustomerUtil.SALE_EXIST_KEY, filterValue),
                    enums: [
                        { label: "Sim", value: "true" },
                        { label: "Não", value: "false" },
                    ],
                },
                bodyCell: (customer) => (customer.comprou ? "Sim" : "Não"),
            },
            {
                id: "updatedAt",
                sortKey: "updatedAt",
                headerCell: "Última Atualização",
                filterOpt: {
                    type: "date",
                    filterDatesStr: activedFilters.updatedAt,
                    onChange: (value) => onChangeDate(CustomerUtil.UPDATED_AT_KEY, value),
                },
                bodyCell: (customer) =>
                    customer.updatedAt.toLocaleDateString("pt-Br", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
            },
        ];
    }, [segments, activedFilters, onChangeText, onChangeDate]);

    return (
        <>
            <LayoutTable.Root>
                <LayoutTable.Header className="justify-content-between">
                    <div className="d-flex gap-2">
                        {activedFiltersCount !== 0 && (
                            <FilterButtons.ClearFilters activedFilters={activedFiltersCount} onClick={onClearFilters} />
                        )}
                    </div>
                    {canAddCustomer({}) && (
                        <BotaoAdicionarDado
                            texto="Cliente"
                            onClickImport={() => setShowImportCustomers(true)}
                            onClickAdd={() => setShowAddCustomer(true)}
                        />
                    )}
                </LayoutTable.Header>
                <LayoutTable.Body>
                    <TableConstructor
                        tableName="Clientes"
                        columns={customerTableColumns}
                        data={customers}
                        actions={customerTableActions}
                        selection={useMemo(() => ({ dataId: "id" as keyof Customer, onSelect: () => {} }), [])}
                        onChangeCurrentPage={setCurrentPage}
                        onChangeSortModeColumn={setSortMode}
                        processing={findingCustomers}
                    />
                </LayoutTable.Body>
            </LayoutTable.Root>

            <ModalImportarClientes
                onImport={importCustomers}
                onFinishImport={() => loadCustomers()}
                show={showImportCustomers}
                onHide={() => {
                    setShowImportCustomers(false);
                    cancelImportCustomers();
                }}
            />

            <OffcanvasCliente
                tipo="criar"
                mostrarForm={showAddCustomer}
                currentUserRole={currentUserRole}
                onCancel={() => {
                    setShowAddCustomer(false);
                }}
                onTerminou={() => loadCustomers()}
            />

            <OffcanvasCliente
                tipo="visualizar"
                mostrarForm={!!customerView}
                dados={customerView}
                currentUserRole={currentUserRole}
                onTerminou={() => {
                    setCustomerView(null);
                    loadCustomers();
                }}
                onCancel={() => {
                    setCustomerView(null);
                }}
            />

            <OffcanvasCliente
                tipo="editar"
                mostrarForm={customerToEdit !== null}
                dados={customerToEdit}
                currentUserRole={currentUserRole}
                onTerminou={() => {
                    setCustomerToEdit(null);
                    loadCustomers();
                }}
                onCancel={() => {
                    setCustomerToEdit(null);
                }}
            />

            <OffcanvasCliente
                tipo="deletar"
                mostrarForm={customerToDelete !== null}
                dados={customerToDelete}
                onTerminou={() => {
                    setCustomerToDelete(null);
                    loadCustomers();
                }}
                onCancel={() => {
                    setCustomerToDelete(null);
                }}
            />

            <ModalAuditoriaCliente
                show={customerToAudit !== null}
                cliente={customerToAudit}
                onHide={() => setCustomerToAudit(null)}
            />
        </>
    );
}
