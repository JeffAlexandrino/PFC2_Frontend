import { Offcanvas } from "react-bootstrap";
import { ReactNode } from "react";

interface IOffcanvasDeletarDadoRoot {
    show?: boolean;
    children?: ReactNode;
}
export default function OffcanvasDeletarDadoRoot(props: IOffcanvasDeletarDadoRoot) {
    return (
        <Offcanvas show={props.show} placement="end" data-test="offcanvas">
            {props.children}
        </Offcanvas>
    );
}
