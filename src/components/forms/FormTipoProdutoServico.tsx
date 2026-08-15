import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import { PartialEntity, tTipoProdutoServico } from "../../interfaces";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { useCallback, useContext } from "react";
import { Formik, FormikHelpers } from "formik";
import { Form, Row } from "react-bootstrap";

import utils from "../../utils";

import * as yup from "yup";

//TYPES
export type tNovoTipoProdutoServico = PartialEntity<tTipoProdutoServico, "name">;

export interface IFormTipoProdutoServicoProps {
    formId?: string;
    onSubmit: (tipo: tNovoTipoProdutoServico) => void | Promise<void>;
    valoresIniciais: tNovoTipoProdutoServico;
}

//FORM
export default function FormTipoProdutoServico(props: IFormTipoProdutoServicoProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //VARIAVEIS
    const { onSubmit, valoresIniciais, formId } = props;

    const onSubmitFormik = useCallback(
        async (tipo: tNovoTipoProdutoServico, helpers: FormikHelpers<tNovoTipoProdutoServico>) => {
            try {
                await onSubmit(tipo);
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
            validationSchema={yupEsquemaTipoProdutoServico}
            onSubmit={onSubmitFormik}
            initialValues={valoresIniciais}
        >
            {({ handleSubmit, values, errors, setValues }) => {
                return (
                    <Form id={formId} onSubmit={handleSubmit}>
                        <Row className="gap-1">
                            <FormGroupInput
                                label="Nome do tipo"
                                required
                                type={FormGroupInputType.TEXT}
                                value={values.name}
                                setValue={(name) => setValues({ ...values, name })}
                                error={errors.name}
                            />
                        </Row>
                    </Form>
                );
            }}
        </Formik>
    );
}

export const yupEsquemaTipoProdutoServico: yup.ObjectSchema<tNovoTipoProdutoServico> = yup.object({
    name: yup.string().required("Campo necessário.").max(256, "Deve ter no máximo 256 carecteres."),
});
