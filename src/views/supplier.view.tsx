import {
    BotaoAdicionarDado,
    OffcanvasFornecedor,
    ModalImportarFornecedores,
    ModalAuditoriaFornecedor,
} from "../components";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ActionTable, Column, SortTable } from "../ui/table/type";
import { ContextUser } from "../contexts/ContextUser";
import { useSearchParams } from "react-router-dom";
import { LayoutTable } from "../layouts/table";
import { Supplier } from "../types/supplier";

import useOnChangeFilter from "../hooks/use-onchange-filter";
import TableConstructor from "../ui/table/constructor";
import SupplierUtil from "../utils/supplier.util";
import useSupplier from "../hooks/use-supplier";
import StringUtil from "../utils/string.util";

import * as FilterButtons from "../components/botoes/filters";

export default function Suppliers() {
    const [searchParams] = useSearchParams();
    const { onChangeDate, onChangeText, onClearFilters } = useOnChangeFilter();

    const { canAddSupplier, canDeleteSupplier } = useContext(ContextUser);
    const { findManySuppliers, cancelFindManySuppliers, createSuppliers, cancelCreateSuppliers, findingSuppliers } =
        useSupplier();

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [sortMode, setSortMode] = useState<SortTable<Supplier> | null>(null);

    const [showAddSupplier, setShowAddSupplier] = useState(false);
    const [showImportSuppliers, setShowImportSuppliers] = useState(false);
    const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
    const [supplierToAudit, setSupplierToAudit] = useState<Supplier | null>(null);
    const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

    const activedFilters = useMemo(() => SupplierUtil.getFilterValuesBy(searchParams), [searchParams]);
    const activedFiltersCount = Object.values(activedFilters).filter((v) => v).length;

    //EVENTOS
    const loadSuppliers = useCallback(() => {
        findManySuppliers({
            page: currentPage,
            limit: SupplierUtil.DEFAULT_LIMIT_PER_PAGE,
            sortBy: sortMode?.by,
            sortType: sortMode?.type,
            where: SupplierUtil.getWhereParamsBy(searchParams),
        })
            .then(setSuppliers)
            .catch((err) => console.error(err));
    }, [findManySuppliers, searchParams, currentPage, sortMode]);

    useEffect(() => {
        loadSuppliers();
        return () => cancelFindManySuppliers();
    }, [loadSuppliers, cancelFindManySuppliers]);

    const supplierTableActions = useMemo(
        (): ((supplier: Supplier) => ActionTable[]) => (supplier) => {
            return [
                { actionDescription: "Auditar", action: () => setSupplierToAudit(supplier) },
                { actionDescription: "Editar", action: () => setSupplierToEdit(supplier) },
                ...(canDeleteSupplier({})
                    ? [{ actionDescription: "Deletar", action: () => setSupplierToDelete(supplier) }]
                    : []),
            ];
        },
        [canDeleteSupplier]
    );

    const supplierTableColumns = useMemo((): Column<Supplier>[] => {
        return [
            {
                id: "name",
                headerCell: "Nome do Fornecedor",
                sortKey: "name",
                filterOpt: {
                    type: "text",
                    placeholder: "Encontrar fornecedor...",
                    filterText: activedFilters.name,
                    onChange: (value) => onChangeText(SupplierUtil.NAME_KEY, value),
                },
                bodyCell: (supplier) => supplier.name,
            },
            {
                id: "cnpj",
                headerCell: "CNPJ",
                sortKey: "cnpj",
                filterOpt: {
                    type: "text",
                    placeholder: "Somente números Ex: 0224...",
                    filterText: activedFilters.cnpj,
                    onChange: (value) => onChangeText(SupplierUtil.CNPJ_KEY, value),
                },
                bodyCell: (supplier) => StringUtil.getCNPJFormat(supplier.cnpj),
            },
            {
                id: "email",
                sortKey: "email",
                headerCell: "E-mail do Responsável",
                filterOpt: {
                    type: "text",
                    placeholder: "Encontrar e-mail...",
                    filterText: activedFilters.email,
                    onChange: (value) => onChangeText(SupplierUtil.EMAIL_KEY, value),
                },
                bodyCell: (supplier) => supplier.email,
            },
            {
                id: "updatedAt",
                sortKey: "updatedAt",
                headerCell: "Última Atualização",
                filterOpt: {
                    type: "date",
                    filterDatesStr: activedFilters.updatedAt,
                    onChange: (value) => onChangeDate(SupplierUtil.UPDATED_AT_KEY, value),
                },
                bodyCell: (supplier) =>
                    supplier.updatedAt.toLocaleDateString("pt-Br", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
            },
        ];
    }, [activedFilters, onChangeDate, onChangeText]);

    return (
        <>
            <LayoutTable.Root>
                <LayoutTable.Header className="justify-content-between">
                    <div className="d-flex gap-2">
                        {activedFiltersCount !== 0 && (
                            <FilterButtons.ClearFilters activedFilters={activedFiltersCount} onClick={onClearFilters} />
                        )}
                    </div>
                    {canAddSupplier({}) && (
                        <BotaoAdicionarDado
                            texto="Fornecedor"
                            onClickAdd={() => setShowAddSupplier(true)}
                            onClickImport={() => setShowImportSuppliers(true)}
                        />
                    )}
                </LayoutTable.Header>
                <LayoutTable.Body>
                    <TableConstructor
                        tableName="Fornecedores"
                        data={suppliers}
                        columns={supplierTableColumns}
                        actions={supplierTableActions}
                        selection={useMemo(() => ({ dataId: "id" as keyof Supplier, onSelect: () => {} }), [])}
                        onChangeCurrentPage={setCurrentPage}
                        onChangeSortModeColumn={setSortMode}
                        processing={findingSuppliers}
                    />
                </LayoutTable.Body>
            </LayoutTable.Root>

            <ModalImportarFornecedores
                onImport={createSuppliers}
                onFinishImport={loadSuppliers}
                show={showImportSuppliers}
                onHide={() => {
                    setShowImportSuppliers(false);
                    cancelCreateSuppliers();
                }}
            />

            <OffcanvasFornecedor
                tipo="criar"
                mostrarForm={showAddSupplier}
                onTerminou={loadSuppliers}
                onCancel={() => {
                    setShowAddSupplier(false);
                }}
            />

            <OffcanvasFornecedor
                tipo="editar"
                mostrarForm={supplierToEdit !== null}
                dados={supplierToEdit}
                onCancel={() => {
                    setSupplierToEdit(null);
                }}
                onTerminou={() => {
                    loadSuppliers();
                    setSupplierToEdit(null);
                }}
            />

            <OffcanvasFornecedor
                tipo="deletar"
                mostrarForm={supplierToDelete !== null}
                dados={supplierToDelete}
                onCancel={() => {
                    setSupplierToDelete(null);
                }}
                onTerminou={() => {
                    loadSuppliers();
                    setSupplierToDelete(null);
                }}
            />

            <ModalAuditoriaFornecedor
                fornecedor={supplierToAudit}
                show={supplierToAudit !== null}
                onHide={() => setSupplierToAudit(null)}
            />
        </>
    );
}
