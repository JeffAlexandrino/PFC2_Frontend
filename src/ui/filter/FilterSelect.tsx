import { ReactNode } from "react";

export interface FilterSelectProps {
    children?: ReactNode;
}

export default function FilterSelect(props: FilterSelectProps) {
    return <span className="user-select-none">{props.children}</span>;
}
