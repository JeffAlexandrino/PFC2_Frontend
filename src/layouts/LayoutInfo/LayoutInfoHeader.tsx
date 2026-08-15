import { Row } from "react-bootstrap";
import { ReactNode } from "react";

import "./styles.css";

interface ILayoutInfoHeaderProps {
    children?: ReactNode;
}

export default function LayoutInfoHeader(props: ILayoutInfoHeaderProps) {
    return <Row className="my-layout-info-header bg-light border-bottom">{props.children}</Row>;
}
