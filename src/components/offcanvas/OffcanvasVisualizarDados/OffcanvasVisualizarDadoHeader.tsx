import { Offcanvas } from "react-bootstrap";
import { ReactNode } from "react";

interface IOffcanvasVisualizarDadoHeader {
    children?: ReactNode;
}

export default function OffcanvasVisualizarDadoHeader(props: IOffcanvasVisualizarDadoHeader) {
    return <Offcanvas.Header className="border-bottom bg-light bg-opacity-25">{props.children}</Offcanvas.Header>;
}
