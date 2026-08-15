import { ReactNode } from "react";

export interface FilterTitleProps {
    children?: ReactNode;
}

export default function FilterTitle(props: FilterTitleProps) {
    return <div data-test="filter-title">{props.children}</div>;
}
