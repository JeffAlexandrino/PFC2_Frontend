import { Offcanvas, Stack } from "react-bootstrap";
import { OffcanvasFormBodyProps } from "./types";

import cn from "../../utils/cn";

export default function Body({ children, className, ...props }: OffcanvasFormBodyProps) {
    return (
        <Offcanvas.Body className="p-0" data-test="offcanvas-body">
            <Stack {...props} className={cn(["d-flex h-100 overflow-x-hidden", className])}>
                {children}
            </Stack>
        </Offcanvas.Body>
    );
}
