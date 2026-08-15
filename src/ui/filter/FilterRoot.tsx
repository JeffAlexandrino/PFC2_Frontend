import React, { ReactNode } from "react";
import { Dropdown } from "react-bootstrap";

export interface FilterRootProps {
    children?: ReactNode;
}

export default function FilterRoot(props: FilterRootProps) {
    //VARIABLES
    const [selectFilter, menuFilter] = React.Children.toArray(props.children);

    return (
        <Dropdown data-test="filter-root">
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                {selectFilter}
            </Dropdown.Toggle>
            {menuFilter}
        </Dropdown>
    );
}

type RefToggle = HTMLDivElement;

const CustomToggle = React.forwardRef<
    RefToggle,
    { children?: ReactNode; onClick: (e: React.MouseEvent<HTMLDivElement>) => void }
>(({ children, onClick }, ref) => {
    //VARIABLES
    const childrenArr = React.Children.toArray(children);
    const [titleElement, selectLabelElement] =
        childrenArr.length === 2 ? childrenArr : childrenArr.length === 1 ? [undefined, ...childrenArr] : [];

    return (
        <div
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            data-test="filter-select"
            className="my-div-filter-text position-relative d-flex justify-content-between align-items-center w-100"
        >
            <span className="text-truncate me-3">
                {titleElement ? (
                    <span className="me-2 rounded-pill p-1 bg-light bg-opacity-50 text-primary">
                        <i className="me-1 bi bi-filter-circle-fill text-primary" />
                        <span className="fw-bold">{titleElement}</span>
                    </span>
                ) : (
                    <i className="me-1 bi bi-filter-circle-fill text-primary" />
                )}
                {selectLabelElement} <i className="bi 
                bi-filter-circle-fill"/>
            </span>
        </div>
    );
});
