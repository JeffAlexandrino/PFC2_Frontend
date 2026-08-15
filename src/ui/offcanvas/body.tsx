import { OffcanvasBodyProps } from "./types";
import { Offcanvas } from "react-bootstrap";

import cn from "../../utils/cn";

export default function Body({ className, ...props }: OffcanvasBodyProps) {
    return (
        <Offcanvas.Body {...props} className={cn(["d-flex flex-column p-0", className])} data-test="offcanvas-body" />
    );
}
