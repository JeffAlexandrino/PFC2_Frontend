import FormGroupSelect from "../../formGroups/FormGroupSelect";
import UserRoleUtil from "../../../utils/user-role.util";
import useUser from "../../../hooks/use-user";

import FormGroupInput, { FormGroupInputType } from "../../formGroups/FormGroupInput";
import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { NewUser } from "../../../types/user";
import { Role } from "../../../types/commom";
import { Stack } from "react-bootstrap";
import { FormikHelpers } from "formik";
import { useCallback } from "react";

import * as yup from "yup";

type AddProps = { show?: boolean; onHide?: () => void; onDone?: () => void; initialRole?: Role };

export default function Add({ show, onHide, onDone, initialRole }: AddProps) {
    const { createUsers, creatingUser, cancelCreateUsers } = useUser();

    const initialValues: NewUser = { name: "", email: "", role: initialRole ?? Role.VENDEDOR };

    const handleOnSubmit = (newUser: NewUser, helpers: FormikHelpers<NewUser>) => {
        createUsers([newUser])
            .then(() => {
                helpers.resetForm();
                if (onDone) onDone();
            })
            .catch(() => helpers.setSubmitting(false));
    };

    const handleOnCancel = useCallback(() => {
        if (onHide) onHide();
        cancelCreateUsers();
    }, [cancelCreateUsers, onHide]);

    return (
        <OffcanvasForm.Root show={show} onHide={handleOnCancel}>
            <OffcanvasForm.Header>
                <OffcanvasForm.Title>Novo Usuário</OffcanvasForm.Title>
            </OffcanvasForm.Header>
            <OffcanvasForm.Body>
                <OffcanvasForm.Formik
                    validateOnChange={false}
                    validationSchema={yupSchemaAddUser}
                    initialValues={initialValues}
                    onSubmit={handleOnSubmit}
                >
                    {({ values, setValues, errors }) => (
                        <Stack className="px-3 gap-3 w-100">
                            <FormGroupInput
                                required
                                label="Nome do usuário"
                                type={FormGroupInputType.TEXT}
                                value={values.name}
                                setValue={(name) => setValues({ ...values, name })}
                                error={errors.name}
                            />
                            <div className="d-flex flex-column gap-1 h-auto">
                                <FormGroupInput
                                    required
                                    label="E-mail do usuário"
                                    type={FormGroupInputType.TEXT}
                                    value={values.email}
                                    setValue={(email) => setValues({ ...values, email })}
                                    error={errors.email}
                                />
                                <small className="text-info">A senha de acesso será enviada a este e-mail!</small>
                            </div>
                            <FormGroupSelect
                                label="Papel do usuário"
                                value={values.role}
                                setValue={(role) => setValues({ ...values, role })}
                                options={Object.values(Role).map((role) => role)}
                                optionTextFn={UserRoleUtil.getRoleDescription}
                                error={errors.role}
                            />
                        </Stack>
                    )}
                </OffcanvasForm.Formik>
                <OffcanvasForm.Footer>
                    <OffcanvasForm.Reset onClick={handleOnCancel}>Cancelar</OffcanvasForm.Reset>
                    <OffcanvasForm.Submit pending={creatingUser}>Adicionar</OffcanvasForm.Submit>
                </OffcanvasForm.Footer>
            </OffcanvasForm.Body>
        </OffcanvasForm.Root>
    );
}

export const yupSchemaAddUser: yup.ObjectSchema<NewUser> = yup.object({
    email: yup.string().email("Insira um e-mail válido.").required("Este campo é necessário."),
    name: yup.string().required("Campo necessário.").max(256, "Deve ter no máximo 256 carecteres."),
    role: yup.mixed<Role>().oneOf(Object.values(Role)).required("Campo necessário."),
});
