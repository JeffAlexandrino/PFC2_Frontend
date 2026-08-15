import { Offcanvas } from "react-bootstrap";
import { ReactNode } from "react";

interface IOffcanvasEditarDadoHeader {
    children?: ReactNode;
}

export default function OffcanvasEditarDadoHeader(props: IOffcanvasEditarDadoHeader) {
    return <Offcanvas.Header className="border-bottom bg-light bg-opacity-25">{props.children}</Offcanvas.Header>;
}
