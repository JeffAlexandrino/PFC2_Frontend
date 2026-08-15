import UserRoleUtil from "../../../utils/user-role.util";
import UserUtil from "../../../utils/user.util";
import useUser from "../../../hooks/use-user";
import Form from "react-bootstrap/Form";

import { DataUpdateUserRole, User } from "../../../types/user";
import { ContextAlerta } from "../../../contexts/ContextAlert";
import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { Button, Stack } from "react-bootstrap";
import { useCallback, useContext } from "react";
import { Role } from "../../../types/commom";
import { FormikHelpers } from "formik";

type ManageRolesProps = { userToManageRoles?: User | null; onDone?: () => void; onHide?: () => void };

export default function ManageRoles({ userToManageRoles, onHide, onDone }: ManageRolesProps) {
    const { manageUserRoles, managingUserRoles, cancelManageUserRoles } = useUser();
    const { setAviso } = useContext(ContextAlerta);

    const initialValues = userToManageRoles && UserUtil.getManageUserRoleData(userToManageRoles);
    const handleOnSubmit = useCallback(
        (manageUserRoleData: DataUpdateUserRole, helpers: FormikHelpers<DataUpdateUserRole>) => {
            if (!userToManageRoles) return;

            if (!manageUserRoleData.userRoles || manageUserRoleData.userRoles.length === 0) {
                setAviso?.("Selecione ao menos um papel antes de atualizar o usuário.");
                helpers.setSubmitting(false);
                return;
            }

            const roles = userToManageRoles.userRoles.map(({ role }) => role);
            const onlyComercialNotManagerRoles = UserRoleUtil.hasOnlyComercialNotManagerRoles(roles) ? "true" : "false";

            manageUserRoles(manageUserRoleData, { onlyComercialNotManagerRoles })
                .then(onDone)
                .catch(() => helpers.setSubmitting(false));
        },
        [onDone, manageUserRoles, userToManageRoles, setAviso]
    );

    const handleOnCancel = useCallback(() => {
        if (onHide) onHide();
        cancelManageUserRoles();
    }, [onHide, cancelManageUserRoles]);

    return (
        <OffcanvasForm.Root show={!!initialValues} onHide={handleOnCancel}>
            <OffcanvasForm.Header>
                <OffcanvasForm.Title>Atualizar Papéis do Usuário</OffcanvasForm.Title>
            </OffcanvasForm.Header>
            {initialValues && (
                <OffcanvasForm.Body>
                    <OffcanvasForm.Formik
                        validateOnChange={false}
                        initialValues={initialValues}
                        onSubmit={handleOnSubmit}
                    >
                        {({ values, setValues, errors }) => {
                            function removeRole(roleToRemove: Role) {
                                setValues({
                                    ...values,
                                    userRoles: values.userRoles.filter(({ role }) => role !== roleToRemove),
                                });
                            }

                            function addRole(roleToAdd: Role) {
                                setValues({
                                    ...values,
                                    userRoles: [...values.userRoles, { role: roleToAdd }],
                                });
                            }

                            function alterFixedCommission(role: Role) {
                                setValues({
                                    ...values,
                                    userRoles: values.userRoles.map((userRole) =>
                                        userRole.role === role
                                            ? { ...userRole, fixedCommission: !userRole.fixedCommission }
                                            : userRole
                                    ),
                                });
                            }

                            return (
                                <Stack className="d-flex gap-3 px-3 w-100">
                                    {Object.values(Role).map((role) => (
                                        <div
                                            key={role}
                                            className="d-flex w-100 border rounded p-1 align-items-center justify-content-between"
                                        >
                                            <span>{UserRoleUtil.getRoleDescription(role)}</span>
                                            {values.userRoles.some(({ role: r }) => r === role) ? (
                                                <div className="d-flex justify-content-center align-items-center gap-2">
                                                    <Form.Check
                                                        type="switch"
                                                        id={role}
                                                        label="Fixar Comissão?"
                                                        defaultChecked={
                                                            values.userRoles.find(({ role: r }) => r === role)
                                                                ?.fixedCommission
                                                        }
                                                        onChange={() => alterFixedCommission(role)}
                                                    />
                                                    {role !== Role.VENDEDOR && (
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            aria-label="Remover papel"
                                                            onClick={() => removeRole(role)}
                                                        >
                                                            <i className="bi bi-trash" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    aria-label="Adicionar papel"
                                                    onClick={() => addRole(role)}
                                                >
                                                    <i className="bi bi-plus-lg" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    {errors.userRoles && (
                                        <small className="text-danger" children={errors.userRoles.length} />
                                    )}
                                    <small className="text-info">
                                        Alguns papéis podem não ser removidos para manter a integridade dos dados do
                                        sistema.
                                    </small>
                                </Stack>
                            );
                        }}
                    </OffcanvasForm.Formik>

                    <OffcanvasForm.Footer>
                        <OffcanvasForm.Reset onClick={onHide}>Cancelar</OffcanvasForm.Reset>
                        <OffcanvasForm.Submit pending={managingUserRoles}>Atualizar</OffcanvasForm.Submit>
                    </OffcanvasForm.Footer>
                </OffcanvasForm.Body>
            )}
        </OffcanvasForm.Root>
    );
}
