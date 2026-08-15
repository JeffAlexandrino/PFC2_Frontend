import { Column, SortTable, TableContextProps, TableConstructorProps, CustomizationSavedColumn } from "./type";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { Spinner, Stack, Table } from "react-bootstrap";
import { Customization } from "./customization";
import { SaleStatus } from "../../types/sale";

import cn from "../../utils/cn";
import TBody from "./tbody";
import THead from "./thead";
import Info from "./info";

import "./styles.css";

export const LOCAL_STORAGE_PREFIX_KEY = "table-customization-";

export const TableContext = React.createContext<TableContextProps<any>>({
    sortModeColumn: null,
    getCustomizationSavedData: () => [],
    onSortModeColumn: () => {},
    setSelectedRows: () => {},
    selectedRows: [],
    amountSelectedRows: 0,
    totalRows: 0,
    tableName: "",
    columns: [],
    setColumns: () => {},
    popColumns: [],
    setPopColumns: () => {},
    filterColumns: false,
    resetFilterColumns: () => {},
});

export default function TableConstructor<Row>({
    selection,
    actions,
    data,
    onChangeCurrentPage,
    onChangeSortModeColumn,
    tableName,
    columns,
    processing,
    selectedSaleStatus,
}: TableConstructorProps<Row>) {
    const [selectedRows, setSelectedRows] = useState<Row[]>([]);
    const [internalColumns, setInternalColumns] = useState<Column<Row>[]>([]);
    const [popColumns, setPopColumns] = useState<Column<Row>[]>([]);
    const [sortModeColumn, setSortModeColumn] = useState<SortTable<Row> | null>(null);
    const [filterColumns, resetFilterColumns] = useState(false);

    const localStorageKey = LOCAL_STORAGE_PREFIX_KEY + tableName;

    // if (internalColumns.length > popColumns.length) {
    //     setPopColumns(internalColumns);
    // }

    const { canReadAudit } = useContext(ContextUser);

    const visibleColumns = useMemo(() => {
        filterColumns ? setInternalColumns(columns) : resetFilterColumns(false);

        const c = canReadAudit({ tabela: "USUARIO" })
            ? internalColumns
            : internalColumns.filter((filterOpt) => filterOpt.id !== "bloqueado");

        setPopColumns(c);
        const internal = c.filter((column) => !column.hide);
        return internal;
    }, [internalColumns, columns, filterColumns, canReadAudit]);

    const filteredColumns = useMemo((): Column<Row>[] => {
        let Columns: Column<Row>[] = [];

        switch (selectedSaleStatus) {
            case SaleStatus.INITIAL:
                Columns = visibleColumns.filter((col) =>
                    [
                        "estadoVenda",
                        "dataVenda",
                        "assistant",
                        "clienteId",
                        "valorVenda",
                        "salePeople",
                        "codigoNota",
                        "updatedAt",
                    ].includes(col.id)
                );
                break;

            case SaleStatus.BILLING_AUDIT:
                Columns = visibleColumns.filter((col) =>
                    [
                        "estadoVenda",
                        "dataVenda",
                        "clienteId",
                        "valorVenda",
                        "salePeople",
                        "codigoNota",
                        "salePeople",
                        "codigoNota",
                        "tipoNota",
                        "valorImpostoNota",
                        "updatedAt",
                    ].includes(col.id)
                );
                break;

            case SaleStatus.FINANCIAL_AUDIT:
                Columns = visibleColumns.filter((col) =>
                    [
                        "estadoVenda",
                        "dataVenda",
                        "salePeople",
                        "valorVenda",
                        "codigoNota",
                        "codigoNota",
                        "comissões",
                        "valorImpostaNota",
                        "clienteId",
                        "updatedAt",
                    ].includes(col.id)
                );
                break;

            case SaleStatus.AVAILABLE_PAYMENT:
                Columns = visibleColumns.filter((col) =>
                    [
                        "estadoVenda",
                        "clienteId",
                        "valorVenda",
                        "dataVenda",
                        "salePeople",
                        "codigoNota",
                        "assistant",
                        "vendaRenovacao",
                        "contratoId",
                        "comissões",
                        "referrer",
                        "updatedAt",
                    ].includes(col.id)
                );
                break;

            case SaleStatus.PAID:
                Columns = visibleColumns.filter((col) =>
                    [
                        "estadoVenda",
                        "dataVenda",
                        "clienteId",
                        "clienteId",
                        "valorVenda",
                        "salePeople",
                        "salePeople",
                        "comissões",
                        "codigoNota",
                        "updatedAt",
                        "numPedidoDistribuidor",
                        "manager",
                    ].includes(col.id)
                );
                break;

            default:
                Columns = visibleColumns;
        }
        return Columns;
    }, [selectedSaleStatus, visibleColumns]);

    const amountSelectedRows = selectedRows.length;
    const totalRows = data.length;

    const handleOnSortModeColumn = useCallback(
        (newSortModeColumn: SortTable<Row> | null) => {
            setSortModeColumn(newSortModeColumn);
            if (onChangeSortModeColumn) onChangeSortModeColumn(newSortModeColumn);
        },
        [onChangeSortModeColumn]
    );

    const getCustomizationSavedData = useCallback(() => {
        const savedCustomization = localStorage.getItem(localStorageKey);
        if (!savedCustomization) return [];

        const unknownData = JSON.parse(savedCustomization);
        if (!Array.isArray(unknownData)) return [];
        if (unknownData.some((item) => typeof item !== "object")) return [];

        return unknownData as CustomizationSavedColumn[];
    }, [localStorageKey]);

    const reflectCustomizationSavedData = useCallback(() => {
        const customizationSavedData = getCustomizationSavedData();
        const customizedColumns: Column<Row>[] = [];

        customizationSavedData.forEach((customSavedData) => {
            const column = columns.find((column) => column.id === customSavedData.columnId);
            if (!column) return;
            return customizedColumns.push({ ...column, hide: customSavedData.hidden });
        });

        const missingColumns = columns.filter(({ id }) =>
            customizationSavedData.every(({ columnId }) => columnId !== id)
        );
        //TODO: save columns if filterColumns is true
        filterColumns ? setInternalColumns(columns) : setInternalColumns([...customizedColumns, ...missingColumns]);
    }, [columns, getCustomizationSavedData, filterColumns]);

    useEffect(() => {
        reflectCustomizationSavedData();
    }, [reflectCustomizationSavedData]);

    return (
        <TableContext.Provider
            value={{
                columns: filteredColumns,
                setColumns: setInternalColumns,
                popColumns: popColumns,
                setPopColumns: setPopColumns,
                tableName,
                amountSelectedRows,
                totalRows,
                selectedRows,
                sortModeColumn,
                setSelectedRows,
                getCustomizationSavedData,
                onSortModeColumn: handleOnSortModeColumn,
                filterColumns: filterColumns,
                resetFilterColumns: resetFilterColumns,
            }}
        >
            <Stack className="d-flex h-100 w-100 border rounded overflow-hidden position-relative">
                <div className="d-flex h-100 w-100 overflow-hidden">
                    <div className="table-content h-100 overflow-auto">
                        <Table hover>
                            <THead
                                visibleColumns={filteredColumns}
                                selection={selection}
                                actions={actions}
                                data={data}
                            />
                            <TBody
                                visibleColumns={filteredColumns}
                                selection={selection}
                                actions={actions}
                                data={data}
                            />
                        </Table>
                    </div>
                    <Customization.Root>
                        <Customization.Overlay.Root overlay={<Customization.Overlay.Popover />}>
                            <Customization.Overlay.Trigger />
                        </Customization.Overlay.Root>
                    </Customization.Root>
                </div>
                <Info onChangeCurrentPage={onChangeCurrentPage} />
                <div
                    className={cn([
                        "top-50 start-50 translate-middle position-absolute",
                        processing ? "d-flex" : "d-none",
                    ])}
                >
                    <Stack className="d-flex align-items-center text-light bg-dark bg-opacity-75 p-2 rounded">
                        <Spinner size="sm" />
                        <span>Carregando...</span>
                    </Stack>
                </div>
            </Stack>
        </TableContext.Provider>
    );
}
