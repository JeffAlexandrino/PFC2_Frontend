import utils from "../../utils";

import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { useCallback, useContext } from "react";
import { Formik, FormikHelpers } from "formik";
import { Form, Row } from "react-bootstrap";

import * as yup from "yup";

//TYPES
export type tNovaSenha = { password: string; confirmPass: string };

export interface IFormNovaSenhaProps {
    formId?: string;
    onSubmit: (dadosSenha: tNovaSenha, helpersFormik: FormikHelpers<tNovaSenha>) => void | Promise<void>;
    valoresIniciais: tNovaSenha;
}

//FORM
export default function FormNovaSenha(props: IFormNovaSenhaProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //VARIAVEIS
    const { onSubmit, valoresIniciais, formId } = props;

    //EVENTOS
    const onSubmitFormik = useCallback(
        async (dadosSenha: tNovaSenha, helpers: FormikHelpers<tNovaSenha>) => {
            if (dadosSenha.password !== dadosSenha.confirmPass)
                return helpers.setErrors({ confirmPass: "As senhas não coincidem." });
            try {
                await onSubmit(dadosSenha, helpers);
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
            validationSchema={yupEsquemaMeta}
            onSubmit={onSubmitFormik}
            initialValues={valoresIniciais}
        >
            {({ handleSubmit, values, errors, setValues }) => {
                return (
                    <Form id={formId} onSubmit={handleSubmit}>
                        <Row className="gap-1">
                            <FormGroupInput
                                label="Nova senha:"
                                type={FormGroupInputType.PASSWORD}
                                required
                                value={values.password}
                                setValue={(password) => setValues({ ...values, password })}
                                error={errors.password}
                            />
                            <FormGroupInput
                                label="Confirme a senha:"
                                type={FormGroupInputType.PASSWORD}
                                required
                                value={values.confirmPass}
                                setValue={(confirmPass) => setValues({ ...values, confirmPass })}
                                error={errors.confirmPass}
                            />
                        </Row>
                        <Row className="mt-3 text-start font-monospace">
                            <div className="fw-bold mb-1"> Caracteres especiais válidos:</div>
                            <div className="border rounded p-2 ps-3 pe-3 text-bold">
                                ~ ! @ # $ % ^ * - _ = + [ {} ] ; : , . ?{" "}
                            </div>
                        </Row>
                    </Form>
                );
            }}
        </Formik>
    );
}

export const yupEsquemaMeta: yup.ObjectSchema<tNovaSenha> = yup.object({
    password: yup
        .string()
        .required("Este campo é necessário.")
        .min(8, "A senha deve conter no mínimo 8 caracteres.")
        .matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, "Coloque ao menos uma letra e um número")
        .matches(/^.*[~!@#$%^*\-_=+[{\]};:,.?]{1}$/m, "Coloque ao menos um caractere especial válido"),
    confirmPass: yup.string().required("Este campo é necessário."),
});
