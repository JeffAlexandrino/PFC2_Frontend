import { CommissionDistribution } from "../types/commission-distribution";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { OffcanvasForm } from "../components/offcanvas-form";
import { ContextUser } from "../contexts/ContextUser";
import { BotaoAdicionarDado } from "../components";
import { LayoutTable } from "../layouts/table";
import { Role } from "../types/commom";

import useCommissionDistribution from "../hooks/use-commission-distribution";
import UserRoleUtil from "../utils/user-role.util";
import cn from "../utils/cn";

export default function Distribuicoes() {
    const {
        canReadCommissionDistribution,
        canDeleteCommissionDistribution,
        canEditCommissionDistribution,
        canAddCommissionDistribution,
        currentUserRole,
    } = useContext(ContextUser);

    const { findManyDistributions, findingManyDistributions, cancelFindManyDistributions } =
        useCommissionDistribution();

    const [role, setRole] = useState<Role>(currentUserRole?.role ?? Role.VENDEDOR);
    const [distributions, setDistributions] = useState<CommissionDistribution[]>([]);

    const [showAdd, setShowAdd] = useState(false);
    const [distributionUpdating, setDistributionUpdating] = useState<CommissionDistribution | null>(null);
    const [distributionDeleting, setDistributionDeleting] = useState<CommissionDistribution | null>(null);

    const loadDistributions = useCallback(() => {
        const where = { role };
        const whereWithUserRole = { userRoleId: undefined, role };

        if (canReadCommissionDistribution(where)) {
            return findManyDistributions({ where }).then(setDistributions).catch(console.error);
        }

        findManyDistributions({ where: whereWithUserRole }).then(setDistributions).catch(console.error);
    }, [findManyDistributions, canReadCommissionDistribution, role]);

    useEffect(() => {
        loadDistributions();

        return () => cancelFindManyDistributions();
    }, [loadDistributions, cancelFindManyDistributions]);

    const resetActionsAndLoadDistributions = useCallback(() => {
        setDistributionUpdating(null);
        setDistributionDeleting(null);
        loadDistributions();
    }, [loadDistributions]);

    return (
        <>
            <LayoutTable.Root>
                <LayoutTable.Header className="justify-content-between">
                    <div className="d-flex gap-2">
                        <div className="d-flex gap-1">
                            {canReadCommissionDistribution({ role }) &&
                                UserRoleUtil.COMERCIAL_ROLES.map((r) => (
                                    <Button
                                        key={r}
                                        size="sm"
                                        variant={r === role ? "primary" : "outline-primary"}
                                        onClick={() => setRole(r)}
                                    >
                                        {UserRoleUtil.getRoleDescription(r)}
                                    </Button>
                                ))}
                        </div>
                    </div>
                    {canAddCommissionDistribution({}) && (
                        <BotaoAdicionarDado onClickAdd={() => setShowAdd(true)} texto="Distribuições" />
                    )}
                </LayoutTable.Header>
                <LayoutTable.Body>
                    {findingManyDistributions && (
                        <div className="d-flex flex-column w-100 align-items-center text-primary">
                            <Spinner size="sm" />
                            <span>Carregando</span>
                        </div>
                    )}

                    {!findingManyDistributions && distributions.length === 0 && (
                        <div className="d-flex flex-column w-100 align-items-center text-secondary-dark">
                            <span>Nenhuma distribuição encontrada</span>
                        </div>
                    )}

                    <Col xs={12}>
                        <Row className="g-3 p-2">
                            {distributions.map((distribution) => (
                                <Col key={distribution.id} xs={12} md={6}>
                                    <Card className="h-100 d-flex flex-column">
                                        <Card.Body className="p-0 pt-1 d-flex flex-column">
                                            <table className="table table-hover mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>{UserRoleUtil.getRoleDescription(role)}</th>
                                                        <th className="text-end">Comissão %</th>
                                                        <th className="text-end">Acelerador %</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {distribution.roleCommissions.map((roleCommission) => (
                                                        <tr key={roleCommission.id}>
                                                            <td>
                                                                <div
                                                                    className="text-truncate"
                                                                    title={roleCommission.userRole.user.name}
                                                                >
                                                                    {roleCommission.userRole.user.name}
                                                                </div>
                                                            </td>
                                                            <td className="text-end">{roleCommission.comissao} %</td>
                                                            <td className="text-end">{roleCommission.acelerator} %</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="mt-auto d-flex justify-content-end gap-2 p-2">
                                                <Button
                                                    className={cn([!canEditCommissionDistribution({}) && "d-none"])}
                                                    size="sm"
                                                    variant="outline-primary"
                                                    onClick={() => setDistributionUpdating(distribution)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    className={cn([!canDeleteCommissionDistribution({}) && "d-none"])}
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => setDistributionDeleting(distribution)}
                                                >
                                                    Deletar
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </LayoutTable.Body>
            </LayoutTable.Root>
            <OffcanvasForm.CommissionDistribution.Delete
                distributionToDelete={distributionDeleting}
                onHide={() => setDistributionDeleting(null)}
                onDone={resetActionsAndLoadDistributions}
            />
            <OffcanvasForm.CommissionDistribution.Manage
                role={role}
                show={showAdd || distributionUpdating !== null}
                distributionToUpdate={distributionUpdating}
                onHide={() => {
                    setDistributionUpdating(null);
                    setShowAdd(false);
                }}
                onDone={resetActionsAndLoadDistributions}
            />
        </>
    );
}
