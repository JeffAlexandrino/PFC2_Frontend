import { ReactNode } from "react";

export interface FilterSelectLabelProps {
    children?: ReactNode;
}

export default function FilterSelectLabel(props: FilterSelectLabelProps) {
    return <span data-test="filter-select-label">{props.children}</span>;
}
