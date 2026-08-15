import { Button, Col, Container, Offcanvas, Row } from "react-bootstrap";
import { ReactNode } from "react";

interface IOffcanvasVisualizarDadoBodyViewOnly {
    children?: ReactNode;
    onClose: () => void;
}

export default function OffcanvasVisualizarDadoBody(props: IOffcanvasVisualizarDadoBodyViewOnly) {
    return (
        <Offcanvas.Body className="p-0 overflow-hidden">
            <Container fluid className="h-100">
                <Row className="justify-content-between h-100">
                    <Col sm="12" className="my-col-body-top p-3">
                        {props.children}
                    </Col>
                    <Col
                        data-test="offcanvas-footer"
                        sm="12"
                        className="my-col-body-bottom d-flex border-top gap-3 justify-content-end align-items-center"
                    >
                        <Button onClick={props.onClose} variant="outline-secondary-dark">
                            Fechar
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Offcanvas.Body>
    );
}
