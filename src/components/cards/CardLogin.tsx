import { Button, Card, Col, Form, Row, Spinner, Stack } from "react-bootstrap";
import { SYSTEM_NAME } from "../../layouts/LayoutPrincipal/LayoutPrincipal";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { useCallback, useContext, useState } from "react";
import api, { tCredenciais } from "../../services/api";
import { Formik, FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";

import FrontRoutes from "../../lib/front-routes";
import InputSenha from "../inputs/InputSenha";
import MyLink from "../links/MyLink";
import utils from "../../utils";

import "./styles.css";
import * as yup from "yup";

export default function CardLogin() {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);
    const navigate = useNavigate();

    //ESTADOS
    const [logando, setLogando] = useState(false);

    //EVENTOS
    const handleSubmit = useCallback(
        async (credenciais: tCredenciais, helpersFormik: FormikHelpers<tCredenciais>) => {
            setLogando(true);
            try {
                await api.login(credenciais);
                helpersFormik.setSubmitting(false);
                navigate(FrontRoutes.getLogged());
            } catch (err) {
                console.error(err);
                setPerigo(utils.retornaMensagemErro(err));
            } finally {
                setLogando(false);
            }
        },
        [navigate, setPerigo]
    );

    return (
        <Card className="my-card-login shadow border-primary">
            <Card.Body>
                <Col sm="12" className="text-center mb-3">
                    <Stack className="d-flex align-items-center gap-1">
                        <img alt="logo" src="/logo192-col.png" style={{ width: "2.5rem", height: "2.5rem" }} />
                        <h4 className="mb-0 text-primary">{SYSTEM_NAME}</h4>
                    </Stack>
                </Col>
                <Col sm="12">
                    <Formik
                        validateOnChange={false}
                        validationSchema={esquemaLogin}
                        onSubmit={handleSubmit}
                        initialValues={{ email: "", password: "" }}
                    >
                        {({ handleSubmit, handleChange, setValues, values, errors }) => (
                            <Form noValidate onSubmit={handleSubmit} className="text-end">
                                <Row className="mb-3 text-start">
                                    <Form.Group as={Col} sm="12" controlId={v4()} className="mb-2">
                                        <Form.Label className="mb-1">Login</Form.Label>
                                        <Form.Control
                                            autoComplete="username"
                                            type="email"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            isInvalid={!!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} sm="12" controlId={v4()}>
                                        <Form.Label className="mb-1">Senha</Form.Label>
                                        <InputSenha
                                            autoComplete="current-password"
                                            valor={values.password}
                                            onAccept={(password) => setValues({ ...values, password })}
                                            isInvalid={!!errors.password}
                                            error={errors.password}
                                        />
                                    </Form.Group>
                                    <Col sm="12">
                                        <MyLink to={FrontRoutes.getRecuperarSenha()}>Esqueceu sua senha?</MyLink>
                                    </Col>
                                </Row>

                                <Button type="submit">
                                    Entrar {logando && <Spinner size="sm" animation="grow" className="ms-1" />}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Card.Body>
        </Card>
    );
}

const esquemaLogin: yup.ObjectSchema<tCredenciais> = yup.object({
    email: yup.string().required("Este campo é necessário.").email("Insira um e-mail válido."),
    password: yup.string().required("Este campo é necessário."),
});
