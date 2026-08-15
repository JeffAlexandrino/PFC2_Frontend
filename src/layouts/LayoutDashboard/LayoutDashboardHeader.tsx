import { Col } from "react-bootstrap";
import { ReactNode } from "react";

import "./styles.css";

interface ILayoutDashboardHeader {
    children?: ReactNode;
}

export default function LayoutDashboardHeader(props: ILayoutDashboardHeader) {
    return (
        <Col className="my-div-layout-dashboard-header border-bottom z-1 gap-2 d-flex align-items-center">
            {props.children}
        </Col>
    );
}
