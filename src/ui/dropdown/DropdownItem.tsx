import { forwardRef, ReactNode, useContext } from "react";
import { ContextDropdown } from "./DropdownRoot";

import "./styles.css";

export interface DropdownItemProps {
    className?: string;
    children?: ReactNode;
    bootstrapNameIcon?: string;
}

type Ref = HTMLDivElement;
const DropdonwItem = forwardRef<Ref, DropdownItemProps>(({ ...props }, ref) => {
    //CONTEXTOS
    const { handleOnOpenMenu } = useContext(ContextDropdown);

    return (
        <div
        data-test="dropdown-item"
            role="button"
            className={
                "my-dropdown-item d-flex align-items-center border rounded p-1 ps-2 pe-2 position-relative " +
                props.className
            }
            ref={ref}
            onClick={handleOnOpenMenu}
        >
            {props.children}
            <i className={`bi bi-${props.bootstrapNameIcon ?? "caret-down-fill"} small ms-1`} />
        </div>
    );
});

export default DropdonwItem;
