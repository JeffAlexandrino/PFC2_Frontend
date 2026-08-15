import { Offcanvas } from "react-bootstrap";
import { ReactNode } from "react";

interface IOffcanvasNovoDadoHeader {
    children?: ReactNode;
}

export default function OffcanvasNovoDadoHeader(props: IOffcanvasNovoDadoHeader) {
    return <Offcanvas.Header className="border-bottom bg-light bg-opacity-25">{props.children}</Offcanvas.Header>;
}
