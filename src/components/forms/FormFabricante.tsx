import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import { PartialEntity, tFabricante } from "../../interfaces";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { useCallback, useContext } from "react";
import { Formik, FormikHelpers } from "formik";
import { Form, Row } from "react-bootstrap";

import utils from "../../utils";

import * as yup from "yup";
//TYPES
export type tNovoFabricante = PartialEntity<tFabricante, "name">;

export interface IFormFabricanteProps {
    formId?: string;
    onSubmit: (fabricante: tNovoFabricante) => void | Promise<void>;
    valoresIniciais: tNovoFabricante;
}

//FORM
export default function FormFabricante(props: IFormFabricanteProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //VARIAVEIS
    const { onSubmit, valoresIniciais, formId } = props;

    const onSubmitFormik = useCallback(
        async (fabricante: tNovoFabricante, helpers: FormikHelpers<tNovoFabricante>) => {
            try {
                await onSubmit(fabricante);
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
            validationSchema={yupEsquemaFabricante}
            onSubmit={onSubmitFormik}
            initialValues={valoresIniciais}
        >
            {({ handleSubmit, values, errors, setValues }) => {
                return (
                    <Form id={formId} onSubmit={handleSubmit}>
                        <Row className="gap-3">
                            <FormGroupInput
                                label="Nome do fabricante"
                                type={FormGroupInputType.TEXT}
                                value={values.name}
                                required
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

export const yupEsquemaFabricante: yup.ObjectSchema<tNovoFabricante> = yup
    .object({
        name: yup.string().required("Campo necessário.").max(256, "Deve ter no máximo 256 carecteres."),
    })
    .strict();
