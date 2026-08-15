import { Card, Col, Container, Row, Stack } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Copy } from "../../components/span";

import FrontRoutes from "../../lib/front-routes";

export default function ErrorInfoUser() {
    //CONTEXTOS
    const { error } = useParams();

    return (
        <Container fluid className="my-full-container bg-light overflow-auto pt-3">
            <Row className="h-100 w-100 align-items-center justify-content-center">
                <Col sm="12" md="10" lg="8" xl="6" xxl="4" className="pb-3">
                    <Card className="shadow">
                        <Card.Header>
                            <h4 className="text-danger">Erro ao buscar informações</h4>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gap-2">
                                <Col sm="12">
                                    <span>
                                        Parece que aconteceu um erro no momento de buscar informações sobre seu usuário.
                                        Tente recarregar o sistema clicando{" "}
                                        <a href={FrontRoutes.getDashboard()}>
                                            <strong>aqui</strong>
                                        </a>
                                        .
                                    </span>
                                </Col>
                                <Col sm="12">
                                    <span>Em caso de não resolver o problema informe este erro:</span>
                                </Col>
                                <Col sm="12">
                                    <Stack className="d-fle w-100">
                                        <div className="d-flex w-100 justify-content-end mb-2">
                                            <Copy textoCopiar={error ?? ""} className="text-secondary-dark small">
                                                Copiar erro
                                            </Copy>
                                        </div>
                                        <div className="d-flex w-100 h-100 bg-secondary bg-opacity-50 rounded p-2">
                                            <code className="fs-6">{error}</code>
                                        </div>
                                    </Stack>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
