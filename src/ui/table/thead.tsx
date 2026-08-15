import React, { useCallback, useContext, useMemo } from "react";
import { ActionTable, Column, SelectionTable } from "./type";
import { TableContext } from "./constructor";
import { Selection } from "./selection";
import { Header } from "./headers";

export type THeadProps<Row> = React.HTMLAttributes<HTMLElement> & {
    selection?: SelectionTable<Row>;
    actions?: (row: Row) => ActionTable[];
    data: Row[];
    visibleColumns: Column<Row>[];
};

//THead gets data and columns visible from Constructor to show and manage the columns
export default function THead<Row>({ selection, actions, data, visibleColumns, ...props }: THeadProps<Row>) {
    const { amountSelectedRows, totalRows, setSelectedRows } = useContext(TableContext);

    const handleOnChangeAllRowSelection = useCallback(
        (checked: boolean) => {
            if (!selection) return;

            if (checked) {
                setSelectedRows(data);
                return selection.onSelect(data);
            }
            setSelectedRows([]);
            return selection.onSelect([]);
        },
        [selection, data, setSelectedRows]
    );

    return (
        <thead {...props} data-test="table-head">
            <tr className="tr-header-row">
                {selection && (
                    <Selection.Header
                        checked={amountSelectedRows > 0 && totalRows > 0}
                        onChangeChecked={handleOnChangeAllRowSelection}
                    />
                )}
                {useMemo(
                    () =>
                        visibleColumns.map((column) =>
                            column.filterOpt ? (
                                column.filterOpt.type === "date" ? (
                                    <Header.Date
                                        key={column.id}
                                        sortKey={column.sortKey}
                                        title={column.headerCell}
                                        filterDatesStr={column.filterOpt.filterDatesStr}
                                        onChange={column.filterOpt.onChange}
                                    />
                                ) : column.filterOpt.type === "enum" ? (
                                    <Header.Enum
                                        sortKey={column.sortKey}
                                        key={column.id}
                                        title={column.headerCell}
                                        enums={column.filterOpt.enums}
                                        filterValue={column.filterOpt.filterValue}
                                        onChange={column.filterOpt.onChange}
                                    />
                                ) : column.filterOpt.type === "text" ? (
                                    <Header.Text
                                        sortKey={column.sortKey}
                                        key={column.id}
                                        title={column.headerCell}
                                        placeholder={column.filterOpt.placeholder}
                                        filterText={column.filterOpt.filterText}
                                        onChange={column.filterOpt.onChange}
                                    />
                                ) : undefined
                            ) : (
                                <Header.NoFilter sortKey={column.sortKey} key={column.id} title={column.headerCell} />
                            )
                        ),
                    [visibleColumns]
                )}
                {actions && <th className="th-action-cell" />}
            </tr>
        </thead>
    );
}
