import { Container } from "react-bootstrap";
import { ReactNode } from "react";

import "./styles.css";

interface ILayoutInfoRootProps {
    children?: ReactNode;
}

export default function LayoutInfoRoot(props: ILayoutInfoRootProps) {
    return (
        <Container fluid className="my-layout-info-root">
            {props.children}
        </Container>
    );
}
