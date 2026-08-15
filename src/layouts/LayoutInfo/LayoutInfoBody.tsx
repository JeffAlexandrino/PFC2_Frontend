import { Row } from "react-bootstrap";
import { ReactNode } from "react";

import "./styles.css";

interface ILayoutInfoBodyProps {
    children?: ReactNode;
}

export default function LayoutInfoBody(props: ILayoutInfoBodyProps) {
    return <Row className="my-layout-info-body">{props.children}</Row>;
}
