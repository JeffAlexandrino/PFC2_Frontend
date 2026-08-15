import BotaoAssincrono, { IBotaoAssincronoProps } from "../../botoes/BotaoAssincrono";
import { Button, ButtonProps, Col, Container, Offcanvas, Row } from "react-bootstrap";
import { ReactNode } from "react";

import "./styles.css";

interface IOffcanvasNovoDadoBody {
    children?: ReactNode;
    cancelButtonProps: ButtonProps;
    acceptButtonProps: IBotaoAssincronoProps;
}

export default function OffcanvasNovoDadoBody(props: IOffcanvasNovoDadoBody) {
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
                        <Button {...props.cancelButtonProps} className="rounded-pill" variant="outline-secondary">
                            Cancelar
                        </Button>
                        <BotaoAssincrono {...props.acceptButtonProps} className="rounded-pill">
                            {props.acceptButtonProps.children ?? "Adicionar"}
                        </BotaoAssincrono>
                    </Col>
                </Row>
            </Container>
        </Offcanvas.Body>
    );
}
