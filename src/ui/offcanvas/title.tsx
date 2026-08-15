import { OffcanvasTitleProps } from "./types";
import { Offcanvas } from "react-bootstrap";

export default function Title(props: OffcanvasTitleProps) {
    return <Offcanvas.Title {...props} />;
}
