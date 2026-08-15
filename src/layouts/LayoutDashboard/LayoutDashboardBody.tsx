import { ContextUser } from "../../contexts/ContextUser";
import { Col, Placeholder, Row } from "react-bootstrap";
import { ReactNode, useContext } from "react";

import "./styles.css";

interface ILayoutDashboardBodyProps {
    children?: ReactNode;
    carregando?: boolean;
}

export default function LayoutDashboardBody(props: ILayoutDashboardBodyProps) {
    //CONTEXTOS
    const { carregandoUsuario } = useContext(ContextUser);

    return (
        <Col sm="12">
            <Row>
                {props.carregando || carregandoUsuario ? (
                    <Col md="12">
                        <Row>
                            <Col md="6" lg="3" className="mb-3">
                                <Placeholder animation="glow" className="opacity-25">
                                    <Placeholder className="my-placeholder-top w-100 rounded-4 mb-0" />
                                </Placeholder>
                            </Col>
                            <Col md="6" lg="3" className="mb-3">
                                <Placeholder animation="glow" className="opacity-25">
                                    <Placeholder className="my-placeholder-top w-100 rounded-4 mb-0" />
                                </Placeholder>
                            </Col>
                            <Col md="6" lg="3" className="mb-3">
                                <Placeholder animation="glow" className="opacity-25">
                                    <Placeholder className="my-placeholder-top w-100 rounded-4 mb-0" />
                                </Placeholder>
                            </Col>
                            <Col md="6" lg="3" className="mb-3">
                                <Placeholder animation="glow" className="opacity-25">
                                    <Placeholder className="my-placeholder-top w-100 rounded-4 mb-0" />
                                </Placeholder>
                            </Col>

                            <Col md="12" lg="6" className="mb-3">
                                <Placeholder animation="glow" className="opacity-25">
                                    <Placeholder className="my-placeholder-center w-100 rounded-4 mb-0" />
                                </Placeholder>
                            </Col>
                            <Col md="12" lg="6" className="mb-3">
                                <Placeholder animation="glow" className="opacity-25">
                                    <Placeholder className="my-placeholder-center w-100 rounded-4 mb-0" />
                                </Placeholder>
                            </Col>

                            <Col md="12" lg="3" className="mb-3">
                                <Placeholder animation="glow" className="opacity-25">
                                    <Placeholder className="my-placeholder-center w-100 rounded-4 mb-0" />
                                </Placeholder>
                            </Col>
                            <Col md="12" lg="3" className="mb-3">
                                <Placeholder animation="glow" className="opacity-25">
                                    <Placeholder className="my-placeholder-center w-100 rounded-4 mb-0" />
                                </Placeholder>
                            </Col>
                            <Col md="12" lg="3" className="mb-3">
                                <Placeholder animation="glow" className="opacity-25">
                                    <Placeholder className="my-placeholder-center w-100 rounded-4 mb-0" />
                                </Placeholder>
                            </Col>
                            <Col md="12" lg="3" className="mb-3">
                                <Placeholder animation="glow" className="opacity-25">
                                    <Placeholder className="my-placeholder-center w-100 rounded-4 mb-0" />
                                </Placeholder>
                            </Col>
                        </Row>
                    </Col>
                ) : (
                    props.children
                )}
            </Row>
        </Col>
    );
}
