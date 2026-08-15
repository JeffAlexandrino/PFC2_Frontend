import { Offcanvas } from "react-bootstrap";
import { ReactNode } from "react";

interface IOffcanvasDeletarDadoHeader {
    children?: ReactNode;
}

export default function OffcanvasDeletarDadoHeader(props: IOffcanvasDeletarDadoHeader) {
    return <Offcanvas.Header className="border-bottom bg-light bg-opacity-25">{props.children}</Offcanvas.Header>;
}
