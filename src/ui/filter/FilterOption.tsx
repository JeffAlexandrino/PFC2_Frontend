import { ReactNode } from "react";
import { Dropdown } from "react-bootstrap";

export interface FilterOptionProps {
    children: ReactNode;
    value: string;
}

export default function FilterOption(props: FilterOptionProps) {
    return (
        <Dropdown.Item data-test="filter-option" eventKey={props.value}>
            {props.children}
        </Dropdown.Item>
    );
}
