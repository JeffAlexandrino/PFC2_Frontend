import { tTabela } from "../src/interfaces";
import { Role } from "../src/types/commom";

export const roles: Role[] = [Role.ADMIN, Role.COMERCIAL_MANAGER, Role.COMMISSIONING_ANALYST, Role.VENDEDOR];

export type tUseAuditoriaProps = { table: tTabela; dataId: string; fixture: string };
export type tViewTableProps = { dataArr?: string[]; length?: number };
export type tDataTestId =
    | "filter-btn"
    | "form-group"
    | "input-search"
    | "select-menu"
    | "filter-menu"
    | "btn-group-add"
    | "btn-group-add-menu"
    | "select-btn"
    | "table-row"
    | "offcanvas"
    | "offcanvas-body"
    | "outros-papeis"
    | "offcanvas-footer"
    | "custom-icon-btn"
    | "edit-icon-btn"
    | "delete-icon-btn"
    | "table-row-actions"
    | "filter-root"
    | "filter-select"
    | "filter-title"
    | "filter-select-label"
    | "filter-option"
    | "dropdown-item"
    | "dropdown-menu"
    | "close-btn"
    | "card-form"
    | "meta-card"
    | "table-filter-button"
    | "table-filter-popover"
    | "table-action-button"
    | "table-action-popover"
    | "table-head"
    | "clear-filters-button"
    | "Markup Bruto";
