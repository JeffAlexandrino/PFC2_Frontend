import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import { PartialEntity, tSegmento } from "../../interfaces";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { useCallback, useContext } from "react";
import { Formik, FormikHelpers } from "formik";
import { Form, Row } from "react-bootstrap";

import utils from "../../utils";

import * as yup from "yup";

//TYPES
export type tNovoSegmento = PartialEntity<tSegmento, "name">;

export interface IFormSegmentoProps {
    formId?: string;
    onSubmit: (segmento: tNovoSegmento) => void | Promise<void>;
    valoresIniciais: tNovoSegmento;
}

//FORM
export default function FormSegmento(props: IFormSegmentoProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //VARIAVEIS
    const { onSubmit, valoresIniciais, formId } = props;

    const onSubmitFormik = useCallback(
        async (segmento: tNovoSegmento, helpers: FormikHelpers<tNovoSegmento>) => {
            try {
                await onSubmit(segmento);
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
            validationSchema={yupEsquemaSegmento}
            onSubmit={onSubmitFormik}
            initialValues={valoresIniciais}
        >
            {({ handleSubmit, values, errors, setValues }) => {
                return (
                    <Form id={formId} onSubmit={handleSubmit}>
                        <Row className="gap-3">
                            <FormGroupInput
                                label="Nome do segmento"
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

export const yupEsquemaSegmento: yup.ObjectSchema<tNovoSegmento> = yup.object({
    name: yup.string().required("Campo necessário.").max(256, "Deve ter no máximo 256 carecteres."),
});
