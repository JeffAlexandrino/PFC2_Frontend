import { Button, Card, Col, Spinner, Stack } from "react-bootstrap";
import FormNovaSenha, { tNovaSenha } from "../forms/FormNovaSenha";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { useCallback, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FormikHelpers } from "formik";

import FrontRoutes from "../../lib/front-routes";
import useAuth from "../../hooks/use-auth";
import MyLink from "../links/MyLink";

import "./styles.css";

let abortController: AbortController | undefined;

const FORM_CRIAR_NOVA_SENHA_ID = "form-criar-nova-senha";

export default function CardCriarNovaSenha() {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);
    const [searchParams] = useSearchParams();

    //ESTADOS
    const { resetingPassword, resetPassword } = useAuth();

    //EVENTOS
    useEffect(() => {
        return () => abortController?.abort();
    }, []);

    const handleSubmit = useCallback(
        async (dadosSenha: tNovaSenha, helpersFormik: FormikHelpers<tNovaSenha>) => {
            const token = searchParams.get("token");
            if (!token) return setPerigo("Este link está corrompido. Obtenha um novo link de recuperação.");

            try {
                await resetPassword(dadosSenha.password, token);
                helpersFormik.setSubmitting(false);
            } catch (err) {
                console.error(err);
            }
        },
        [setPerigo, searchParams, resetPassword]
    );

    return (
        <Card className="my-card-criar-nova-senha shadow border-primary">
            <Card.Body>
                <Col sm="12" className="text-center mb-3">
                    <Stack className="d-flex align-items-center gap-1">
                        <img className="my-img-logo" alt="logo" src="/logo192-col.png" />
                        <h4 className="mb-0 text-primary">NextGen CommissionPro</h4>
                    </Stack>
                </Col>
                <Col sm="12">
                    <FormNovaSenha
                        formId={FORM_CRIAR_NOVA_SENHA_ID}
                        valoresIniciais={{ password: "", confirmPass: "" }}
                        onSubmit={handleSubmit}
                    />
                </Col>
                <Col sm="12">
                    <MyLink to={FrontRoutes.getLogin()}>Realizar login?</MyLink>
                </Col>
                <Col sm="12" className="text-end mt-3">
                    <Button type="submit" form={FORM_CRIAR_NOVA_SENHA_ID}>
                        Mudar Senha
                        {resetingPassword && <Spinner size="sm" animation="grow" className="ms-1" />}
                    </Button>
                </Col>
            </Card.Body>
        </Card>
    );
}
