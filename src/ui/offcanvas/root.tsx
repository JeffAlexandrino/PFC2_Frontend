import { OffcanvasRootProps } from "./types";
import { Offcanvas } from "react-bootstrap";

export default function Root({ placement, ...props }: OffcanvasRootProps) {
    return <Offcanvas {...props} placement={placement ?? "end"} data-test="offcanvas"/>;
}
