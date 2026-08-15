import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import { PartialEntity, tFormaPagamento } from "../../interfaces";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { useCallback, useContext } from "react";
import { Formik, FormikHelpers } from "formik";
import { Form, Row } from "react-bootstrap";

import utils from "../../utils";

import * as yup from "yup";
//TYPES
export type tNovaFormaPagamento = PartialEntity<tFormaPagamento, "name">;

export interface IFormFormaPagamentoProps {
    formId?: string;
    onSubmit: (formaPagamento: tNovaFormaPagamento) => void | Promise<void>;
    valoresIniciais: tNovaFormaPagamento;
}

//FORM
export default function FormFormaPagamento(props: IFormFormaPagamentoProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //VARIAVEIS
    const { onSubmit, valoresIniciais, formId } = props;

    const onSubmitFormik = useCallback(
        async (formaPagamento: tNovaFormaPagamento, helpers: FormikHelpers<tNovaFormaPagamento>) => {
            try {
                await onSubmit(formaPagamento);
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
            validationSchema={yupEsquemaFormaPagamento}
            onSubmit={onSubmitFormik}
            initialValues={valoresIniciais}
        >
            {({ handleSubmit, values, errors, setValues }) => {
                return (
                    <Form id={formId} onSubmit={handleSubmit}>
                        <Row className="gap-3">
                            <FormGroupInput
                                label="Nome da Forma de Pagamento"
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

export const yupEsquemaFormaPagamento: yup.ObjectSchema<tNovaFormaPagamento> = yup.object({
    name: yup.string().required("Campo necessário.").max(256, "Deve ter no máximo 256 carecteres."),
});
