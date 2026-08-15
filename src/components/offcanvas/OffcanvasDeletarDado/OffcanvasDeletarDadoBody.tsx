import BotaoAssincrono, { IBotaoAssincronoProps } from "../../botoes/BotaoAssincrono";
import { Button, ButtonProps, Col, Container, Offcanvas, Row } from "react-bootstrap";
import { ReactNode } from "react";

import "./styles.css";

interface IOffcanvasDeletarDadoBody {
    children?: ReactNode;
    cancelButtonProps: ButtonProps;
    acceptButtonProps: IBotaoAssincronoProps;
}

export default function OffcanvasDeletarDadoBody(props: IOffcanvasDeletarDadoBody) {
    return (
        <Offcanvas.Body className="p-0 overflow-hidden">
            <Container fluid className="h-100">
                <Row className="justify-content-between h-100">
                    <Col sm="12" className="my-col-body-top p-3">
                        <Row>
                            <Col sm="12" className="border border-danger rounded pt-3 position-relative p-3">
                                <span className="p-2 fw-bold text-danger bg-white position-absolute top-0 start-50 translate-middle">
                                    AVISO
                                </span>
                                {props.children}
                            </Col>
                        </Row>
                    </Col>
                    <Col
                        data-test="offcanvas-footer"
                        sm="12"
                        className="my-col-body-bottom d-flex border-top gap-3 justify-content-end align-items-center"
                    >
                        <Button {...props.cancelButtonProps} className="rounded-pill" variant="outline-secondary">
                            Cancelar
                        </Button>
                        <BotaoAssincrono {...props.acceptButtonProps} className="rounded-pill" variante="danger">
                            Deletar
                        </BotaoAssincrono>
                    </Col>
                </Row>
            </Container>
        </Offcanvas.Body>
    );
}
