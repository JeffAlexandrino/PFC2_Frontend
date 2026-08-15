import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import { CustomerOrigin, getOriginDescription, NewCustomer } from "../../types/customer";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { useCallback, useContext } from "react";
import { Formik, FormikHelpers } from "formik";
import { Form, Row } from "react-bootstrap";

import FormGroupGeneric from "../formGroups/FormGroupGeneric";
import FormGroupSelect from "../formGroups/FormGroupSelect";
import SelectCliente from "../selects/SelectCliente";
import SelectSegmento from "../selects/SelectSegmento";
import utils from "../../utils";

import * as yup from "yup";

//TYPES
export interface IFormClienteProps {
    formId?: string;
    onSubmit: (cliente: NewCustomer) => void | Promise<void>;
    valoresIniciais: NewCustomer;
    readOnly?: boolean;
    disabledFields?: ("name" | "cnpj" | "email" | "telefone")[];
}

//FORM
export default function FormCliente(props: IFormClienteProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //VARIAVEIS
    const { onSubmit, valoresIniciais, formId, readOnly, disabledFields = [] } = props;

    const onSubmitFormik = useCallback(
        async (cliente: NewCustomer, helpers: FormikHelpers<NewCustomer>) => {
            try {
                await onSubmit(cliente);
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
            data-test="form-cliente"
            validateOnChange={false}
            validationSchema={yupEsquemaCliente}
            onSubmit={onSubmitFormik}
            initialValues={valoresIniciais}
        >
            {({ handleSubmit, values, errors, setValues }) => {
                return (
                    <Form id={formId} onSubmit={handleSubmit}>
                        <Row className="row-gap-1">
                            <FormGroupInput
                                label="Nome do cliente"
                                type={FormGroupInputType.TEXT}
                                value={values.name}
                                required
                                setValue={(name) => setValues({ ...values, name })}
                                error={errors.name}
                                disabled={readOnly || disabledFields.includes("name")}
                            />
                            <FormGroupInput
                                label="CNPJ do cliente"
                                type={FormGroupInputType.TEXT}
                                value={values.cnpj}
                                mask="00.000.000/0000-00"
                                required
                                setValue={(cnpj) => setValues({ ...values, cnpj })}
                                error={errors.cnpj}
                                disabled={readOnly || disabledFields.includes("cnpj")}
                            />
                            <FormGroupInput
                                label="E-mail"
                                type={FormGroupInputType.TEXT}
                                value={values.email}
                                required
                                setValue={(email) => setValues({ ...values, email })}
                                error={errors.email}
                                disabled={readOnly || disabledFields.includes("email")}
                            />
                            <FormGroupInput
                                label="Telefone para contato"
                                type={FormGroupInputType.TEXT}
                                mask={["0000-0000", "(00) 00000-0000", "+00 (00) 00000-0000", "(00) 0000-0000"]}
                                value={values.telefone}
                                required
                                setValue={(telefone) => setValues({ ...values, telefone })}
                                error={errors.telefone}
                                disabled={readOnly || disabledFields.includes("telefone")}
                            />
                            <FormGroupSelect
                                label="Origem do cliente"
                                value={values.origem}
                                error={errors.origem}
                                options={Object.values(CustomerOrigin)}
                                optionTextFn={(option) => getOriginDescription(option)}
                                setValue={(origem) =>
                                    setValues({
                                        ...values,
                                        origem,
                                        ...(origem === CustomerOrigin.INDICATION
                                            ? {}
                                            : { clienteIndicadorId: null, observacao: null }),
                                    })
                                }
                                disabled={readOnly}
                            />
                            {values.origem === CustomerOrigin.INDICATION && (
                                <FormGroupGeneric label="Indicador">
                                    <SelectCliente idSelecionado={values.name ?? null} />
                                </FormGroupGeneric>
                            )}

                            <FormGroupGeneric label="Segmento" error={errors.segmentoId}>
                                <SelectSegmento
                                    idSelecionado={values.segmentoId}
                                    setIdSelecionado={(segmentoId) =>
                                        setValues({ ...values, segmentoId: segmentoId ?? "" })
                                    }
                                />
                            </FormGroupGeneric>
                        </Row>
                    </Form>
                );
            }}
        </Formik>
    );
}

export const yupEsquemaCliente: yup.ObjectSchema<NewCustomer> = yup.object({
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
    telefone: yup.string().required("Campo necessário."),
    origem: yup.string().oneOf(Object.values(CustomerOrigin), "Origem inválida.").required("Campo necessário."),
    clienteIndicadorId: yup
        .string()
        .nullable()
        .when("origem", {
            is: CustomerOrigin.INDICATION,
            then: (schema) => schema.required("Campo necessário."),
            otherwise: (schema) => schema.nullable().notRequired(),
        }),
    observacao: yup.string().nullable().max(256, "Deve ter no máximo 256 caracteres.").notRequired(),
    segmentoId: yup.string().required("Campo necessário."),
});
