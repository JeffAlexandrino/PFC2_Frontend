import { ButtonProps, FormControlProps, OverlayTriggerProps, PopoverProps } from "react-bootstrap";
import { InputCheckboxProps } from "../../components/inputs/InputCheckbox";
import { OverlayChildren } from "react-bootstrap/esm/Overlay";
import { SaleStatus } from "../../types/sale";

import React from "react";

export type SelectionTable<Row> = { onSelect: React.Dispatch<React.SetStateAction<Row[]>>; dataId: keyof Row };
export type ActionTable = { actionDescription: string; action: () => void };
export type Column<Row> = {
    id: string;
    headerCell: string;
    bodyCell?: (data: Row) => React.ReactNode;
    sortKey?: keyof Row & string;
    filterOpt?:
        | { type: "date"; onChange?: (filterDates?: FilterDatesStr) => void; filterDatesStr?: FilterDatesStr }
        | { type: "text"; placeholder?: string; onChange?: (filterText?: string) => void; filterText?: string }
        | { type: "enum"; enums: FilterEnum[]; onChange?: (filterValue?: string) => void; filterValue?: string };
    hide?: boolean;
};

export type TableConstructorProps<Row> = {
    data: Row[];
    tableName: string;
    columns: Column<Row>[];
    actions?: (row: Row) => ActionTable[];
    selection?: SelectionTable<Row>;
    onChangeCurrentPage?: (page: number) => void;
    onChangeSortModeColumn?: (sortModeColumn: SortTable<Row> | null) => void;
    processing?: boolean;
    selectedSaleStatus?: SaleStatus;
};
export type TableContextProps<Row> = {
    tableName: string;
    columns: Column<Row>[];
    popColumns: Column<Row>[];
    setPopColumns: React.Dispatch<React.SetStateAction<Column<Row>[]>>;
    selectedRows: Row[];
    amountSelectedRows: number;
    totalRows: number;
    getCustomizationSavedData: () => CustomizationSavedColumn[];
    setSelectedRows: React.Dispatch<React.SetStateAction<Row[]>>;
    setColumns: React.Dispatch<React.SetStateAction<Column<Row>[]>>;
    sortModeColumn: SortTable<Row> | null;
    onSortModeColumn: (sortModeColumn: SortTable<Row> | null) => void;
    filterColumns: boolean;
    resetFilterColumns: (status: boolean) => void;
};

export type SortType = "asc" | "desc";
export type SortTable<Row> = { by: keyof Row; type: SortType };
export type FilterDates = { lte: Date; gte: Date };
export type FilterDatesStr = { lte: string; gte: string };
export type FilterEnum = { label: string; value: string };

export type HeaderProps = {
    title: string;
    sortKey?: string;
};
export type HeaderDateProps = HeaderProps & {
    filterDatesStr?: FilterDatesStr;
    onChange?: (filterDates?: FilterDatesStr) => void;
};
export type HeaderEnumProps = HeaderProps & {
    enums: FilterEnum[];
    filterValue?: string;
    onChange?: (filterValue?: string) => void;
};
export type HeaderTextProps = HeaderProps & {
    placeholder?: string;
    filterText?: string;
    onChange?: (filterText?: string) => void;
};

export type OverlayActionProps = { actions?: ActionTable[] };
export type OverlayFilterProps = Omit<OverlayTriggerProps, "children"> & { isFiltered?: boolean };
export type OverlaySortProps = Omit<OverlayTriggerProps, "overlay" | "children"> & {
    children: string;
    overlay?: OverlayChildren;
    sortKey?: string;
};

export type PopoverRootProps = PopoverProps & {};
export type PopoverHeaderProps = React.HTMLAttributes<HTMLDivElement> & {};
export type PopoverBodyProps = React.HTMLAttributes<HTMLDivElement> & {};
export type PopoverContentProps = React.HTMLAttributes<HTMLDivElement> & {};
export type PopoverResetButtonProps = ButtonProps & {};

export type FilterControlProps = FormControlProps & {};

export type FilterEnumButtonProps = ButtonProps & { isActive?: boolean };

export type SelectionHeaderCellProps = InputCheckboxProps;
export type SelectionBodyCellProps = InputCheckboxProps;

export type CustomizationSavedColumn = { columnId: string; hidden: boolean };
