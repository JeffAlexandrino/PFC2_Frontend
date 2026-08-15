import { Button, Card, Col, Form, Row, Spinner, Stack } from "react-bootstrap";
import { useCallback, useEffect } from "react";
import { Formik, FormikHelpers } from "formik";
import { v4 } from "uuid";

import FrontRoutes from "../../lib/front-routes";
import useAuth from "../../hooks/use-auth";
import MyLink from "../links/MyLink";

import * as yup from "yup";
import "./styles.css";

let abortController: AbortController | undefined;

export default function CardRecuperarSenha() {
    const { getResetPasswordToken, gettingResetPasswordToken } = useAuth();

    useEffect(() => {
        return () => abortController?.abort();
    }, []);

    const handleSubmit = useCallback(
        async (dados: { email: string }, helpersFormik: FormikHelpers<{ email: string }>) => {
            try {
                await getResetPasswordToken(dados.email);
                helpersFormik.setSubmitting(false);
            } catch (err) {
                console.error(err);
            }
        },
        [getResetPasswordToken]
    );

    return (
        <Card className="my-card-recuperar-senha shadow border-primary">
            <Card.Body>
                <Col sm="12" className="text-center mb-3">
                    <Stack className="d-flex align-items-center gap-1">
                        <img className="my-img-logo" alt="logo" src="/logo192-col.png" />
                        <h4 className="mb-0 text-primary">NextGen CommissionPro</h4>
                    </Stack>
                </Col>
                <Col sm="12" className="lh-1 mb-2">
                    <div className="d-flex rounded bg-info bg-opacity-25 p-2">
                        <p className="my-card-recuperar-senha-text-info m-0 text-info small">
                            Caso o e-mail informado esteja cadastrado, serão enviadas instruções para recuperar sua
                            senha.
                        </p>
                    </div>
                </Col>
                <Col sm="12">
                    <Formik
                        validateOnChange={false}
                        validationSchema={esquemaRecuperarSenha}
                        onSubmit={handleSubmit}
                        initialValues={{ email: "" }}
                    >
                        {({ handleSubmit, handleChange, setValues, values, errors }) => (
                            <Form noValidate onSubmit={handleSubmit} className="text-end">
                                <Row className="mb-3 text-start">
                                    <Form.Group as={Col} sm="12" controlId={v4()} className="mb-2">
                                        <Form.Label className="mb-1">E-mail</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            isInvalid={!!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Col sm="12">
                                        <MyLink to={FrontRoutes.getLogin()}>Realizar login?</MyLink>
                                    </Col>
                                </Row>
                                <Button type="submit">
                                    Receber instruções
                                    {gettingResetPasswordToken && (
                                        <Spinner size="sm" animation="grow" className="ms-1" />
                                    )}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Card.Body>
        </Card>
    );
}

const esquemaRecuperarSenha: yup.ObjectSchema<{ email: string }> = yup.object({
    email: yup.string().required("Este campo é necessário.").email("Insira um e-mail válido."),
});
