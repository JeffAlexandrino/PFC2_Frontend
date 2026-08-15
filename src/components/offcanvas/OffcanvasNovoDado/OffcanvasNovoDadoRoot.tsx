import { Offcanvas } from "react-bootstrap";
import { ReactNode } from "react";

interface IOffcanvasNovoDadoRoot {
    show?: boolean;
    children?: ReactNode;
}
export default function OffcanvasNovoDadoRoot(props: IOffcanvasNovoDadoRoot) {
    return (
        <Offcanvas show={props.show} placement="end" data-test="offcanvas">
            {props.children}
        </Offcanvas>
    );
}
