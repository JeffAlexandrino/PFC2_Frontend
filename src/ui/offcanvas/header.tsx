import { OffcanvasHeaderProps } from "./types";
import { Offcanvas } from "react-bootstrap";

import cn from "../../utils/cn";

export default function Header({ className, closeButton, ...props }: OffcanvasHeaderProps) {
    return <Offcanvas.Header {...props} className={cn(["border-bottom", className])} closeButton={closeButton ?? true}/>;
}
