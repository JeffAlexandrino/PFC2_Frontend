import { Col, Container, Placeholder, Row } from "react-bootstrap";
import { ContextUser } from "../../contexts/ContextUser";
import { ReactNode, useContext } from "react";

import "./styles.css";

interface ILayoutInfoBodyRightProps {
    children?: ReactNode;
    carregando?: boolean;
}

export default function LayoutInfoBodyRight(props: ILayoutInfoBodyRightProps) {
    //CONTEXTOS
    const { carregandoUsuario } = useContext(ContextUser);

    return (
        <div className="my-div-lib-right d-flex">
            {props.carregando || carregandoUsuario ? (
                <Container fluid className="mt-2 overflow-auto h-100">
                    <Row className="mb-4">
                        <Col sm="2">
                            <Placeholder as="small" className="opacity-25" animation="glow">
                                <Placeholder sm="12" className="rounded" />
                            </Placeholder>
                        </Col>
                        <Col sm="2">
                            <Placeholder as="small" className="opacity-25" animation="glow">
                                <Placeholder sm="12" className="rounded" />
                            </Placeholder>
                        </Col>
                        <Col sm="2">
                            <Placeholder as="small" className="opacity-25" animation="glow">
                                <Placeholder sm="12" className="rounded" />
                            </Placeholder>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12">
                            <Placeholder className="mb-4 opacity-25" as="h5" animation="glow">
                                <Placeholder xs={6} className="rounded" />
                            </Placeholder>
                            <Placeholder className="opacity-25" as="span" animation="glow">
                                <Placeholder xs={7} className="rounded" /> <Placeholder xs={4} className="rounded" />{" "}
                                <Placeholder xs={4} className="rounded" /> <Placeholder xs={6} className="rounded" />{" "}
                                <Placeholder xs={8} className="rounded" />
                            </Placeholder>
                        </Col>
                    </Row>
                </Container>
            ) : (
                props.children
            )}
        </div>
    );
}
