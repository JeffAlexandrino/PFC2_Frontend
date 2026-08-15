import { Offcanvas } from "react-bootstrap";
import { ReactNode } from "react";

interface IOffcanvasVisualizarDadoRoot {
    show?: boolean;
    children?: ReactNode;
}
export default function OffcanvasVisualizarDadoRoot(props: IOffcanvasVisualizarDadoRoot) {
    return (
        <Offcanvas show={props.show} placement="end" data-test="offcanvas">
            {props.children}
        </Offcanvas>
    );
}
