import FormGroupInput, { FormGroupInputType } from "../../formGroups/FormGroupInput";
import FormGroupGeneric from "../../formGroups/FormGroupGeneric";
import SelectUserRole from "../../selects/select-user-role";
import UserRoleUtil from "../../../utils/user-role.util";

import { NewRoleCommission } from "../../../types/commission-distribution";
import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { Role } from "../../../types/commom";
import { Row, Stack } from "react-bootstrap";

import * as yup from "yup";

type RoleCommissionProps = {
    onHide?: () => void;
    onSubmit: (values: NewRoleCommission) => void;
    roleCommissionUpdating?: NewRoleCommission | null;
    show?: boolean;
    role: Role;
};

export default function RoleCommission(props: RoleCommissionProps) {
    const initialValues = props.roleCommissionUpdating ?? { userRoleId: "", comissao: 0, acelerator: 0 };

    return (
        <OffcanvasForm.Root show={props.show} onHide={props.onHide}>
            <OffcanvasForm.Header>
                <OffcanvasForm.Title>Comissão de {UserRoleUtil.getRoleDescription(props.role)}</OffcanvasForm.Title>
            </OffcanvasForm.Header>
            <OffcanvasForm.Body>
                <OffcanvasForm.Formik
                    initialValues={initialValues}
                    onSubmit={props.onSubmit}
                    validationSchema={yupSalePersonCommissionSchema}
                >
                    {({ values, setValues, errors }) => (
                        <Stack className="d-flex px-3 w-100">
                            <FormGroupGeneric
                                label={UserRoleUtil.getRoleDescription(props.role)}
                                error={errors.userRoleId}
                            >
                                <SelectUserRole
                                    selectedId={values.userRoleId}
                                    setSelectedId={(id) => setValues({ ...values, userRoleId: id ?? "" })}
                                    role={props.role}
                                />
                            </FormGroupGeneric>

                            <Row className="d-flex">
                                <FormGroupInput
                                    sm="6"
                                    type={FormGroupInputType.PORCENT}
                                    label="Comissão"
                                    required
                                    value={values.comissao}
                                    setValue={(comissao) => setValues({ ...values, comissao })}
                                    error={errors.comissao}
                                />

                                <FormGroupInput
                                    sm="6"
                                    type={FormGroupInputType.PORCENT}
                                    label="Acelerador"
                                    required
                                    value={values.acelerator}
                                    setValue={(acelerator) => setValues({ ...values, acelerator })}
                                    error={errors.acelerator}
                                />
                            </Row>
                        </Stack>
                    )}
                </OffcanvasForm.Formik>
                <OffcanvasForm.Footer>
                    <OffcanvasForm.Reset>Cancelar</OffcanvasForm.Reset>
                    <OffcanvasForm.Submit>{props.roleCommissionUpdating ? "Editar" : "Adicionar"}</OffcanvasForm.Submit>
                </OffcanvasForm.Footer>
            </OffcanvasForm.Body>
        </OffcanvasForm.Root>
    );
}

export const yupSalePersonCommissionSchema: yup.ObjectSchema<NewRoleCommission> = yup.object({
    userRoleId: yup.string().required("Selecione um vendedor."),
    comissao: yup.number().required("Este campo é necessário."),
    acelerator: yup.number().required("Este campo é necessário."),
});
