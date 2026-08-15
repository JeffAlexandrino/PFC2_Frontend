import { Col, Container, Row } from "react-bootstrap";
import { CardRecuperarSenha } from "../components";

export default function RecuperarSenha() {
    return (
        <Container fluid className="my-full-container overflow-auto pt-3 bg-light">
            <Row className="align-items-center w-100 h-100 justify-content-center">
                <Col className="d-flex justify-content-center w-100">
                    <CardRecuperarSenha />
                </Col>
            </Row>
        </Container>
    );
}
