import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import { PartialEntity, tContrato } from "../../interfaces";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { useCallback, useContext } from "react";
import { Formik, FormikHelpers } from "formik";
import { Form, Row } from "react-bootstrap";

import FormGroupBoolean from "../formGroups/FormGroupBoolean";
import utils from "../../utils";

import * as yup from "yup";

//TYPES
export type tNovoContrato = PartialEntity<tContrato, "name" | "comissaoPrimeiraParcela">;

export interface IFormContratoProps {
    formId?: string;
    onSubmit: (contrato: tNovoContrato) => void | Promise<void>;
    valoresIniciais: tNovoContrato;
}

//FORM
export default function FormContrato(props: IFormContratoProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //VARIAVEIS
    const { onSubmit, valoresIniciais, formId } = props;

    const onSubmitFormik = useCallback(
        async (contrato: tNovoContrato, helpers: FormikHelpers<tNovoContrato>) => {
            try {
                await onSubmit(contrato);
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
            validationSchema={yupEsquemaContrato}
            onSubmit={onSubmitFormik}
            initialValues={valoresIniciais}
        >
            {({ handleSubmit, values, errors, setValues }) => {
                return (
                    <Form id={formId} onSubmit={handleSubmit}>
                        <Row className="row-gap-1">
                            <FormGroupInput
                                label="Nome do contrato"
                                type={FormGroupInputType.TEXT}
                                required
                                value={values.name}
                                setValue={(name) => setValues({ ...values, name })}
                                error={errors.name}
                            />
                            <FormGroupBoolean
                                label="Comissão será paga na primeira parcela?"
                                value={values.comissaoPrimeiraParcela}
                                setValue={(comissaoPrimeiraParcela) =>
                                    setValues({ ...values, comissaoPrimeiraParcela })
                                }
                                error={errors.comissaoPrimeiraParcela}
                            />
                        </Row>
                    </Form>
                );
            }}
        </Formik>
    );
}

export const yupEsquemaContrato: yup.ObjectSchema<tNovoContrato> = yup.object({
    name: yup.string().required("Campo necessário.").max(256, "Deve ter no máximo 256 carecteres."),
    comissaoPrimeiraParcela: yup.boolean().required("Campo necessário."),
});
