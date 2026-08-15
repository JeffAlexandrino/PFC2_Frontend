import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { NewUserRole } from "../../types/user-role";
import { useCallback, useContext } from "react";
import { Formik, FormikHelpers } from "formik";
import { Form, Row } from "react-bootstrap";
import { Role } from "../../types/commom";

import utils from "../../utils";

import * as yup from "yup";

//TYPES
export interface IFormVendedorProps {
    formId?: string;
    onSubmit: (vendedor: NewUserRole) => void | Promise<void>;
    valoresIniciais: NewUserRole;
}

export default function FormVendedor(props: IFormVendedorProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //VARIAVEIS
    const { onSubmit, valoresIniciais, formId } = props;

    const onSubmitFormik = useCallback(
        async (vendedor: NewUserRole, helpers: FormikHelpers<NewUserRole>) => {
            try {
                await onSubmit(vendedor);
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
            validationSchema={yupEsquemaVendedor}
            onSubmit={onSubmitFormik}
            initialValues={valoresIniciais}
        >
            {({ handleSubmit, values, errors, setValues }) => {
                return (
                    <Form id={formId} onSubmit={handleSubmit}>
                        <Row className="gap-2">
                            <FormGroupInput
                                label="Nome do vendedor"
                                required
                                type={FormGroupInputType.TEXT}
                                value={values.name}
                                setValue={(name) => setValues({ ...values, name })}
                                error={errors.name}
                            />
                            <FormGroupInput
                                label="E-mail do vendedor"
                                required
                                type={FormGroupInputType.TEXT}
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

export const yupEsquemaVendedor: yup.ObjectSchema<NewUserRole> = yup.object({
    email: yup.string().required("Este campo é necessário."),
    name: yup.string().required("Campo necessário.").max(256, "Deve ter no máximo 256 carecteres."),
    role: yup.mixed<Role>().oneOf(Object.values(Role)).required("Campo necessário."),
});
