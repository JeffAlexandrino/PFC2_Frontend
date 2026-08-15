import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import { PartialEntity, tFornecedor } from "../../interfaces";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { useCallback, useContext } from "react";
import { Formik, FormikHelpers } from "formik";
import { Form, Row } from "react-bootstrap";

import utils from "../../utils";

import * as yup from "yup";

//TYPES
export type tNovoFornecedor = PartialEntity<tFornecedor, "name" | "cnpj" | "email">;

export interface IFormFornecedorProps {
    formId?: string;
    onSubmit: (fornecedor: tNovoFornecedor) => void | Promise<void>;
    valoresIniciais: tNovoFornecedor;
}

//FORM
export default function FormFornecedor(props: IFormFornecedorProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //VARIAVEIS
    const { onSubmit, valoresIniciais, formId } = props;

    const onSubmitFormik = useCallback(
        async (fornecedor: tNovoFornecedor, helpers: FormikHelpers<tNovoFornecedor>) => {
            try {
                await onSubmit(fornecedor);
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
            data-test="form-fornecedor"
            validateOnChange={false}
            validationSchema={yupEsquemaFornecedor}
            onSubmit={onSubmitFormik}
            initialValues={valoresIniciais}
        >
            {({ handleSubmit, values, errors, setValues }) => {
                return (
                    <Form id={formId} onSubmit={handleSubmit}>
                        <Row className="row-gap-1">
                            <FormGroupInput
                                label="Nome do fornecedor"
                                type={FormGroupInputType.TEXT}
                                value={values.name}
                                required
                                setValue={(name) => setValues({ ...values, name })}
                                error={errors.name}
                            />
                            <FormGroupInput
                                label="CNPJ do fornecedor"
                                type={FormGroupInputType.TEXT}
                                value={values.cnpj}
                                required
                                mask="00.000.000/0000-00"
                                setValue={(cnpj) => setValues({ ...values, cnpj })}
                                error={errors.cnpj}
                            />
                            <FormGroupInput
                                label="E-mail do responsável"
                                type={FormGroupInputType.TEXT}
                                required
                                value={values.email}
                                setValue={(email) => setValues({ ...values, email })}
                                error={errors.email}
                            />
                        </Row>
                    </Form>
                );
            }}
        </Formik>
    );
}

export const yupEsquemaFornecedor: yup.ObjectSchema<tNovoFornecedor> = yup.object({
    name: yup.string().required("Campo necessário.").max(256, "Deve ter no máximo 256 carecteres."),
    cnpj: yup
        .string()
        .required("Campo necessário.")
        .min(14, "Um CNPJ válido deve ter 14 dígitos.")
        .max(14, "Um CNPJ válido deve ter 14 dígitos."),
    email: yup
        .string()
        .email("Insira um e-mail válido.")
        .required("Campo necessário.")
        .max(256, "Deve ter no máximo 256 caracteres."),
});
