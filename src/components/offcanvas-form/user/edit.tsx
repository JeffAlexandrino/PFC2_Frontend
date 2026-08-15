import FormGroupInput, { FormGroupInputType } from "../../formGroups/FormGroupInput";
import UserRoleUtil from "../../../utils/user-role.util";
import UserUtil from "../../../utils/user.util";
import useUser from "../../../hooks/use-user";

import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { DataUpdateUserInfo, User } from "../../../types/user";
import { Stack } from "react-bootstrap";
import { FormikHelpers } from "formik";
import { useCallback } from "react";

import * as yup from "yup";

type EditProps = { userToEdit?: User | null; onDone?: () => void; onHide?: () => void };

export default function Edit({ userToEdit, onHide, onDone }: EditProps) {
    const { updateUser, updatingUser, cancelUpdateUser } = useUser();

    const initialValues = userToEdit && UserUtil.getOnlyEditData(userToEdit);

    const handleOnSubmit = useCallback(
        (editUserData: DataUpdateUserInfo, helpers: FormikHelpers<DataUpdateUserInfo>) => {
            if (!userToEdit) return;
            const roles = userToEdit?.userRoles.map(({ role }) => role);
            const onlyComercialNotManagerRoles = UserRoleUtil.hasOnlyComercialNotManagerRoles(roles) ? "true" : "false";
            updateUser(editUserData, { onlyComercialNotManagerRoles })
                .then(onDone)
                .catch(() => helpers.setSubmitting(false));
        },
        [onDone, updateUser, userToEdit]
    );

    const handleOnCancel = useCallback(() => {
        if (onHide) onHide();
        cancelUpdateUser();
    }, [onHide, cancelUpdateUser]);

    return (
        <OffcanvasForm.Root show={!!initialValues} onHide={handleOnCancel}>
            <OffcanvasForm.Header>
                <OffcanvasForm.Title>Editar Usuário</OffcanvasForm.Title>
            </OffcanvasForm.Header>
            {initialValues && (
                <OffcanvasForm.Body>
                    <OffcanvasForm.Formik
                        validateOnChange={false}
                        validationSchema={yupSchemaUpdateUser}
                        initialValues={initialValues}
                        onSubmit={handleOnSubmit}
                    >
                        {({ values, setValues, errors }) => (
                            <Stack className="d-flex px-3 gap-3 w-100">
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
                                </div>
                                <div className="d-flex align-items-start gap-2 border border-danger rounded-3 p-3 text-danger">
                                    <div className="form-check mt-1">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="BlockedCheckbox"
                                            checked={values.bloqueado}
                                            onChange={() => setValues({ ...values, bloqueado: !values.bloqueado })}
                                        />
                                        <label className="form-check-label fw-semibold" htmlFor="BlockedCheckbox">
                                            Bloquear?
                                        </label>
                                    </div>

                                    <div className="small">
                                        <ul className="mb-0 ps-3">
                                            <li>O usuário não poderá acessar o sistema.</li>
                                            <li>A senha será redefinida.</li>
                                        </ul>
                                    </div>
                                </div>
                            </Stack>
                        )}
                    </OffcanvasForm.Formik>

                    <OffcanvasForm.Footer>
                        <OffcanvasForm.Reset onClick={onHide}>Cancelar</OffcanvasForm.Reset>
                        <OffcanvasForm.Submit pending={updatingUser}>Editar</OffcanvasForm.Submit>
                    </OffcanvasForm.Footer>
                </OffcanvasForm.Body>
            )}
        </OffcanvasForm.Root>
    );
}

export const yupSchemaUpdateUser: yup.ObjectSchema<DataUpdateUserInfo> = yup.object({
    id: yup.string().required("Campo necessário."),
    email: yup.string().email("Insira um e-mail válido.").required("Este campo é necessário."),
    name: yup.string().required("Campo necessário.").max(256, "Deve ter no máximo 256 carecteres."),
    bloqueado: yup.boolean().required("Campo necessário."),
});
