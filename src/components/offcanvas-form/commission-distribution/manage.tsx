import useCommissionDistribution from "../../../hooks/use-commission-distribution";
import RoleCommission, { yupSalePersonCommissionSchema } from "./role-commission";
import useUserRole from "../../../hooks/use-user-role";
import BotaoFechar from "../../botoes/BotaoFechar";
import BotaoLabel from "../../botoes/BotaoLabel";

import {
    EditCommissionDistributionData,
    NewCommissionDistribution,
    NewRoleCommission,
} from "../../../types/commission-distribution";
import { useCallback, useContext, useEffect, useState } from "react";
import { ContextAlerta } from "../../../contexts/ContextAlert";
import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { Button, Form, Stack } from "react-bootstrap";
import { UserRole } from "../../../types/user-role";
import { FormikHelpers } from "formik";
import { v4 } from "uuid";

import * as yup from "yup";
import { Role } from "../../../types/commom";

type ManageDistributionProps = {
    onHide?: () => void;
    onDone?: () => void;
    show?: boolean;
    distributionToUpdate?: EditCommissionDistributionData | null;
    role: Role;
};

export default function Manage({ onHide, onDone, distributionToUpdate, role, show }: ManageDistributionProps) {
    const { setAviso } = useContext(ContextAlerta);
    const { findUsersRole: findManyUsersRole } = useUserRole();
    const { createDistributions, updateDistribution, creatingDistribution, updatingDistribution } =
        useCommissionDistribution();

    const [roles, serRoles] = useState<UserRole[]>([]);

    const [roleCommissions, setRoleCommissions] = useState<NewRoleCommission[]>([]);

    const [showAddRoleCommission, setShowAddRoleCommission] = useState(false);
    const [roleCommissionUpdating, setRoleCommissionUpdating] = useState<NewRoleCommission | null>(null);

    const distributionIdUpdating = distributionToUpdate?.id;
    const initialValues = { roleCommissions: distributionToUpdate?.roleCommissions ?? [] };

    useEffect(() => {
        if (!show) return;
        findManyUsersRole({ where: { role } })
            .then((salePersonRoles) => serRoles(salePersonRoles))
            .catch(console.error);
    }, [findManyUsersRole, role, show]);

    useEffect(() => {
        if (distributionToUpdate) setRoleCommissions(distributionToUpdate.roleCommissions);
    }, [distributionToUpdate]);

    const addOrUpdateRoleCommission = useCallback(
        (roleCommission: NewRoleCommission) => {
            if (roleCommissionUpdating) {
                setRoleCommissions((prev) =>
                    prev.map((prevValue) =>
                        prevValue.userRoleId === roleCommission.userRoleId ? roleCommission : prevValue
                    )
                );
                return setRoleCommissionUpdating(null);
            }

            if (roleCommissions.some(({ userRoleId }) => userRoleId === roleCommission.userRoleId))
                return setAviso("Este usuário já possui comissão, escolha outro.");

            setRoleCommissions((prev) => [...prev, roleCommission]);
            setShowAddRoleCommission(false);
        },
        [roleCommissionUpdating, roleCommissions, setAviso]
    );

    const deleteRoleCommission = useCallback(
        (salePersonCommission: NewRoleCommission) =>
            setRoleCommissions((prev) =>
                prev.filter(({ userRoleId }) => userRoleId !== salePersonCommission.userRoleId)
            ),
        []
    );

    const resetValuesAndHide = useCallback(() => {
        setRoleCommissions([]);
        if (onHide) onHide();
    }, [onHide]);

    const handleOnSubmit = useCallback(
        (_: NewCommissionDistribution, helper: FormikHelpers<NewCommissionDistribution>) => {
            if (roleCommissions.length === 0) return helper.setErrors({ roleCommissions: "Adicione ao menos 1." });

            if (distributionIdUpdating)
                return updateDistribution({ id: distributionIdUpdating, roleCommissions: roleCommissions })
                    .then(() => {
                        setRoleCommissions([]);
                        if (onDone) onDone();
                    })
                    .catch(console.error);

            return createDistributions([{ roleCommissions: roleCommissions }])
                .then(() => {
                    setRoleCommissions([]);
                    if (onDone) onDone();
                })
                .catch(console.error);
        },
        [distributionIdUpdating, onDone, updateDistribution, createDistributions, roleCommissions]
    );

    return (
        <>
            <OffcanvasForm.Root show={show} onHide={resetValuesAndHide}>
                <OffcanvasForm.Header>
                    <OffcanvasForm.Title>
                        {distributionToUpdate ? "Editar distribuição" : "Nova distribuição"}
                    </OffcanvasForm.Title>
                </OffcanvasForm.Header>
                <OffcanvasForm.Body>
                    <OffcanvasForm.Formik initialValues={initialValues} onSubmit={handleOnSubmit}>
                        {({ errors }) => (
                            <Stack className="d-flex px-3 w-100">
                                <Form.Group controlId={v4()}>
                                    <Form.Label as="h6">Usuários com comissão</Form.Label>
                                    <Form.Control isInvalid={!!errors.roleCommissions} className="d-none" />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.roleCommissions as string}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <RoleCommissionsList
                                    roleCommissions={roleCommissions}
                                    userRoles={roles}
                                    onClickAdd={() => setShowAddRoleCommission(true)}
                                    onClickEdit={setRoleCommissionUpdating}
                                    onClickDelete={deleteRoleCommission}
                                />
                            </Stack>
                        )}
                    </OffcanvasForm.Formik>
                </OffcanvasForm.Body>
                <OffcanvasForm.Footer>
                    <OffcanvasForm.Reset>Cancelar</OffcanvasForm.Reset>
                    <OffcanvasForm.Submit pending={creatingDistribution || updatingDistribution}>
                        {distributionToUpdate ? "Editar" : "Adicionar"}
                    </OffcanvasForm.Submit>
                </OffcanvasForm.Footer>
            </OffcanvasForm.Root>

            <RoleCommission
                role={role}
                onSubmit={addOrUpdateRoleCommission}
                show={showAddRoleCommission || !!roleCommissionUpdating}
                roleCommissionUpdating={roleCommissionUpdating}
                onHide={() => {
                    setShowAddRoleCommission(false);
                    setRoleCommissionUpdating(null);
                }}
            />
        </>
    );
}

function RoleCommissionsList(props: {
    roleCommissions: NewRoleCommission[];
    userRoles: UserRole[];
    onClickAdd: () => void;
    onClickEdit: (roleCommission: NewRoleCommission) => void;
    onClickDelete: (roleCommission: NewRoleCommission) => void;
}) {
    return (
        <Stack className="d-flex w-100 gap-2 align-items-end">
            {props.roleCommissions.map((salePersonCommission) => {
                const salePerson = props.userRoles.find(({ id }) => id === salePersonCommission.userRoleId);
                return (
                    <div className="d-flex w-100" key={v4()} data-test="card-form">
                        <Stack className="d-flex w-100 position-relative border rounded shadow-sm p-2">
                            <div className="position-absolute end-0 top-0 mt-1 me-1 z-1">
                                <BotaoFechar onClick={() => props.onClickDelete(salePersonCommission)} />
                            </div>
                            <BotaoLabel
                                variant="info"
                                texto={salePerson?.user.name ?? ""}
                                onClick={() => props.onClickEdit(salePersonCommission)}
                            />
                            <div className="d-flex w-100 justify-content-between">
                                <small>Comissão:</small>
                                <small>{salePersonCommission.comissao.toFixed(2)} %</small>
                            </div>
                            <div className="d-flex w-100 justify-content-between">
                                <small>Acelerador:</small>
                                <small>{salePersonCommission.acelerator.toFixed(2)} %</small>
                            </div>
                        </Stack>
                    </div>
                );
            })}

            <div className="d-flex text-end">
                <Button className="rounded-pill" size="sm" onClick={props.onClickAdd}>
                    Adicionar
                </Button>
            </div>
        </Stack>
    );
}

export const yupManageSalePersonRoleDistributionSchema: yup.ObjectSchema<NewCommissionDistribution> = yup.object({
    roleCommissions: yup.array(yupSalePersonCommissionSchema).required("Este campo é requerido."),
});
