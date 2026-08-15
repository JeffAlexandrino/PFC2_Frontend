import { Placement } from "react-bootstrap/esm/types";
import { ContextDropdown } from "./DropdownRoot";
import { ReactNode, useContext } from "react";
import { Overlay } from "react-bootstrap";

import "./styles.css";

export interface DropdownMenuProps {
    children?: ReactNode;
    target: HTMLElement | null;
    rootClose?: boolean;
    placement?: Placement;
}

export default function DropdownMenu({ children, ...rest }: DropdownMenuProps) {
    //CONTEXTOS
    const { handleOnHideMenu, menuOpened } = useContext(ContextDropdown);

    return (
        <Overlay {...rest} show={menuOpened} onHide={handleOnHideMenu}>
            {({
                placement: _placement,
                arrowProps: _arrowProps,
                show: _show,
                popper: _popper,
                hasDoneInitialMeasure: _hasDoneInitialMeasure,
                ...overlayProps
            }) => (
                <div
                    data-test="dropdown-menu"
                    className="my-dropdown-menu mt-1 bg-white rounded shadow p-2 text-dark"
                    {...overlayProps}
                >
                    {children}
                </div>
            )}
        </Overlay>
    );
}
