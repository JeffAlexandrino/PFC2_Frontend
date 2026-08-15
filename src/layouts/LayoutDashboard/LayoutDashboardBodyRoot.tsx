import { Container, Row } from "react-bootstrap";
import { ReactNode } from "react";

import "./styles.css";

interface ILayoutDashboardBodyRootProps {
    children?: ReactNode;
}

export default function LayoutDashboardBodyRoot(props: ILayoutDashboardBodyRootProps) {
    return (
        <div className="my-div-layout-dashboard-body-root bg-white">
            <Container fluid>
                <Row className="pt-3 pb-3">{props.children}</Row>
            </Container>
        </div>
    );
}
