import React, { ReactNode, useState } from "react";
import { Dropdown, Form } from "react-bootstrap";

export interface FilterMenuProps {
    className?: string;
    children?: ReactNode;
}

export default function FilterMenu(props: FilterMenuProps) {
    return <Dropdown.Menu as={CustomMenu}>{props.children}</Dropdown.Menu>;
}

type Ref = HTMLDivElement;
const CustomMenu = React.forwardRef<Ref, FilterMenuProps>(({ children, className }, ref) => {
    const [value, setValue] = useState("");

    return (
        <div ref={ref} className={className} aria-labelledby="aria-labelledby" data-test="filter-menu">
            <Form.Control
                autoFocus
                className="mx-3 my-2 w-auto"
                placeholder="Type to filter..."
                onChange={(e) => setValue(e.target.value)}
                value={value}
            />
            <ul className="list-unstyled">{children}</ul>
        </div>
    );
});
