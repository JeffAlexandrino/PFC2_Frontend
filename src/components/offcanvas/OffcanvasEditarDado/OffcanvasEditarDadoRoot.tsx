import { Offcanvas } from "react-bootstrap";
import { ReactNode } from "react";

interface IOffcanvasEditarDadoRoot {
    show?: boolean;
    children?: ReactNode;
}
export default function OffcanvasEditarDadoRoot(props: IOffcanvasEditarDadoRoot) {
    return (
        <Offcanvas show={props.show} placement="end" data-test="offcanvas">
            {props.children}
        </Offcanvas>
    );
}
