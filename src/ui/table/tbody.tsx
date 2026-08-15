import { ActionTable, Column, SelectionTable } from "./type";
import { useCallback, useContext, useMemo } from "react";
import { TableContext } from "./constructor";
import { Selection } from "./selection";
import { v4 } from "uuid";

import cn from "../../utils/cn";
import { Overlay } from "./overlays";

export type TBodyProps<Row> = React.HTMLAttributes<HTMLElement> & {
    selection?: SelectionTable<Row>;
    actions?: (row: Row) => ActionTable[];
    data: Row[];
    visibleColumns: Column<Row>[];
};
//TBody gets the data from Constructor to organize and show each data(user,sells,commissions) on each row
export default function TBody<Row>({ className, data, selection, actions, visibleColumns, ...props }: TBodyProps<Row>) {
    const { selectedRows, setSelectedRows } = useContext(TableContext);

    const rowIsSelected = useCallback(
        (rowToCheck: Row) => {
            if (!selection) return false;
            return selectedRows.some((row) => row[selection.dataId] === rowToCheck[selection.dataId]);
        },
        [selectedRows, selection]
    );

    const handleOnChangeRowSelection = useCallback(
        (checked: boolean, row: Row) => {
            if (!selection) return;

            if (checked) {
                setSelectedRows((prev) => [...prev, row]);
                return selection.onSelect((prev) => [...prev, row]);
            }
            setSelectedRows((prev) => prev.filter((prev) => prev !== row));
            return selection.onSelect((prev) => prev.filter((prev) => prev !== row));
        },
        [selection, setSelectedRows]
    );

    return (
        <tbody {...props} className={cn(["h-auto", className])}>
            {useMemo(
                () =>
                    data.map((row) => {
                        return (
                            <tr
                                data-test={"table-row"}
                                className={["tr-body-row", rowIsSelected(row) && "selected"].join(" ")}
                                key={v4()}
                            >
                                {selection && (
                                    <Selection.Body
                                        checked={rowIsSelected(row)}
                                        onChangeChecked={(checked) => handleOnChangeRowSelection(checked, row)}
                                    />
                                )}
                                {visibleColumns.map((column) => (
                                    <td key={v4()}>{column.bodyCell ? column.bodyCell(row) : undefined}</td>
                                ))}

                                <td className={cn(["td-action-cell text-center", !actions && "d-none"])} data-test="table-action-btn">
                                    <Overlay.Action  actions={actions ? actions(row) : undefined} />
                                </td>
                            </tr>
                        );
                    }),
                [data, visibleColumns, selection, actions, rowIsSelected, handleOnChangeRowSelection]
            )}
        </tbody>
    );
}
