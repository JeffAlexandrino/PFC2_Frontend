import { Container, Row } from "react-bootstrap";
import { ReactNode } from "react";

import "./styles.css";

interface ILayoutDashboardRootProps {
    children?: ReactNode;
}

export default function LayoutDashboardRoot(props: ILayoutDashboardRootProps) {
    return (
        <Container fluid className="my-div-layout-dashboard-root h-100">
            <Row className="h-100">{props.children}</Row>
        </Container>
    );
}
