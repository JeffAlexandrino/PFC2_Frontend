import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { NewOrganization } from "../../types/organization";
import { useCallback, useContext } from "react";
import { Formik, FormikHelpers } from "formik";
import { Form, Row } from "react-bootstrap";

import FormGroupGeneric from "../formGroups/FormGroupGeneric";
import utils from "../../utils";

import * as yup from "yup";

//TYPES
export interface IFormOrganizationProps {
    formId?: string;
    onSubmit: (organization: NewOrganization) => void | Promise<void>;
    valoresIniciais: NewOrganization;
}

const validFileExtensions = { image: ["jpg", "png", "jpeg", "webp"] };
const MAX_FILE_SIZE = 500000;

//FORM
export default function FormOrganization(props: IFormOrganizationProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //VARIAVEIS
    const { onSubmit, valoresIniciais, formId } = props;

    const onSubmitFormik = useCallback(
        async (organization: NewOrganization, helpers: FormikHelpers<NewOrganization>) => {
            try {
                await onSubmit(organization);
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
            data-test="form-organization"
            validateOnChange={false}
            validationSchema={yupOrganizationSchema}
            onSubmit={onSubmitFormik}
            initialValues={valoresIniciais}
        >
            {({ handleSubmit, values, errors, setValues }) => {
                const organizationLogo = values.logo ? URL.createObjectURL(values.logo) : undefined;

                return (
                    <Form id={formId} onSubmit={handleSubmit}>
                        <Row className="row-gap-2">
                            <div className="d-flex w-100">
                                <div
                                    className={`d-flex ratio ratio-1x1 w-25 ${
                                        !organizationLogo && "rounded bg-secondary opacity-50"
                                    }`}
                                >
                                    <img
                                        src={organizationLogo}
                                        alt="logo"
                                        className={`h-100 w-100 ${
                                            !organizationLogo && "opacity-0"
                                        } bg-opacity-25 object-fit-cover`}
                                    />
                                </div>
                                <div className="d-flex w-75 justify-content-start">
                                    <FormGroupGeneric
                                        align="start"
                                        label={
                                            <div className="d-flex ms-2 bg-primary rounded text-white px-2">
                                                Selecionar Imagem
                                            </div>
                                        }
                                        type="file"
                                        accept={validFileExtensions.image.map((type) => `.${type}`).join(", ")}
                                        setValue={(e) =>
                                            setValues({ ...values, logo: e.target.files?.item(0) ?? null })
                                        }
                                        error={errors.logo}
                                    />
                                </div>
                            </div>

                            <FormGroupInput
                                label="Nome da empresa"
                                type={FormGroupInputType.TEXT}
                                value={values.name}
                                required
                                setValue={(name) => setValues({ ...values, name })}
                                error={errors.name}
                            />
                            <FormGroupInput
                                label="CNPJ da empresa"
                                type={FormGroupInputType.TEXT}
                                value={values.cnpj}
                                mask="00.000.000/0000-00"
                                required
                                setValue={(cnpj) => setValues({ ...values, cnpj })}
                                error={errors.cnpj}
                            />
                        </Row>
                    </Form>
                );
            }}
        </Formik>
    );
}

function isValidFileType(fileName: string, fileType: "image"): boolean {
    return !!fileName && validFileExtensions[fileType].indexOf(fileName.split(".").pop() ?? "") !== -1;
}

export const yupOrganizationSchema: yup.ObjectSchema<NewOrganization> = yup.object({
    logo: yup
        .mixed<File>()
        .test(
            "is-valid-type",
            "Insira uma imágem válida.",
            (value) => value === null || isValidFileType((value && value.name.toLowerCase()) ?? "", "image")
        )
        .test(
            "is-valid-size",
            "O tamanho máximo é de 100KB",
            (value: any) => value === null || value.size <= MAX_FILE_SIZE
        )
        .required("Campo necessário.")
        .nullable(),
    cnpj: yup
        .string()
        .required("Campo necessário.")
        .min(14, "Um CNPJ válido deve ter 14 dígitos.")
        .max(14, "Um CNPJ válido deve ter 14 dígitos."),
    name: yup.string().required("Campo necessário.").max(256, "Deve ter no máximo 256 caracteres."),
});
