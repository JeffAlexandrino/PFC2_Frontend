import { OffcanvasFormHeaderProps } from "./types";
import { Offcanvas } from "react-bootstrap";

import cn from "../../utils/cn";

export default function Header({ closeButton, className, ...props }: OffcanvasFormHeaderProps) {
    return (
        <Offcanvas.Header {...props} closeButton={closeButton ?? true} className={cn(["border-bottom", className])} />
    );
}
