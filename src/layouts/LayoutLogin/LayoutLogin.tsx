import { Col, Container, Row } from "react-bootstrap";
import { CardLogin } from "../../components";

import "./styles.css";

export default function LayoutLogin() {
    return (
        <Container fluid className="my-container-login bg-light">
            <Row className="h-100 align-items-center">
                <Col className="d-flex justify-content-center">
                    <CardLogin />
                </Col>
            </Row>
        </Container>
    );
}
