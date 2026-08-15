import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import { PartialEntity, tPapelUsuario, tUser } from "../../interfaces";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { useCallback, useContext } from "react";
import { Formik, FormikHelpers } from "formik";
import { Form, Row } from "react-bootstrap";

import utils from "../../utils";

import * as yup from "yup";

//TYPES
export type tNovoUser = PartialEntity<tUser, "name" | "email" | "role" | "bloqueado">;

export interface IFormGerenteProps {
    formId?: string;
    onSubmit: (gerente: tNovoUser) => void | Promise<void>;
    valoresIniciais: tNovoUser;
}

//FORM
export default function FormGerente(props: IFormGerenteProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //VARIAVEIS
    const { onSubmit, valoresIniciais, formId } = props;

    const onSubmitFormik = useCallback(
        async (admin: tNovoUser, helpers: FormikHelpers<tNovoUser>) => {
            try {
                await onSubmit(admin);
                helpers.setSubmitting(false);
                helpers.resetForm();
            } catch (err) {
                if (utils.blErroCancelamento(err)) return;
                setPerigo(utils.retornaMensagemErro(err));
                console.error(err);
            }
        },
        [onSubmit, setPerigo]
    );

    return (
        <Formik
            validateOnChange={false}
            validationSchema={yupEsquemaGerente}
            onSubmit={onSubmitFormik}
            initialValues={valoresIniciais}
        >
            {({ handleSubmit, values, errors, setValues }) => {
                return (
                    <Form id={formId} onSubmit={handleSubmit}>
                        <Row className="row-gap-1">
                            <FormGroupInput
                                label="Nome do gerente de vendas"
                                type={FormGroupInputType.TEXT}
                                required
                                value={values.name}
                                setValue={(name) => setValues({ ...values, name })}
                                error={errors.name}
                            />
                            <FormGroupInput
                                label="E-mail do gerente de vendas"
                                type={FormGroupInputType.TEXT}
                                required
                                value={values.email}
                                setValue={(email) => setValues({ ...values, email })}
                                error={errors.email}
                            >
                                <small className="text-secondary-dark lh-1">
                                    A senha de acesso será enviada a este e-mail.
                                </small>
                            </FormGroupInput>
                        </Row>
                    </Form>
                );
            }}
        </Formik>
    );
}

export const yupEsquemaGerente: yup.ObjectSchema<tNovoUser> = yup.object({
    email: yup.string().email("Insira um e-mail válido.").required("Este campo é necessário."),
    role: yup.mixed<tPapelUsuario>().oneOf(["GERENTE_VENDAS"]).required("Este campo é necessário"),
    name: yup.string().required("Campo necessário.").max(256, "Deve ter no máximo 256 carecteres."),
    bloqueado: yup.boolean().required("Este campo é necessário."),
});
