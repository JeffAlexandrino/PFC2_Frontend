import { CommissionDistribution } from "../../types/commission-distribution";
import { useCallback, useContext, useEffect, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { Button, Card, Spinner } from "react-bootstrap";
import { OffcanvasForm } from "../offcanvas-form";
import { Offcanvas } from "../../ui/offcanvas";
import { Role } from "../../types/commom";

import useCommissionDistribution from "../../hooks/use-commission-distribution";
import UserRoleUtil from "../../utils/user-role.util";
import StringUtil from "../../utils/string.util";
import cn from "../../utils/cn";

type CommissionDistributionsProps = {
    show?: boolean;
    onHide?: () => void;
    role: Role;
};

export default function CommissionDistributions({ role, show, onHide }: CommissionDistributionsProps) {
    const {
        canReadCommissionDistribution,
        canAddCommissionDistribution,
        canDeleteCommissionDistribution,
        canEditCommissionDistribution,
        currentUserRole,
    } = useContext(ContextUser);

    const { findManyDistributions, findingManyDistributions, cancelFindManyDistributions } =
        useCommissionDistribution();

    const [distributions, setDistributions] = useState<CommissionDistribution[]>([]);

    const [showAdd, setShowAdd] = useState(false);
    const [distributionUpdating, setDistributionUpdating] = useState<CommissionDistribution | null>(null);
    const [distributionDeleting, setDistributionDeleting] = useState<CommissionDistribution | null>(null);

    const loadDistributions = useCallback(() => {
        const where = { role };
        const whereWithUserRole = { userRoleId: currentUserRole?.id, role };

        if (canReadCommissionDistribution(where))
            return findManyDistributions({ where }).then(setDistributions).catch(console.error);

        findManyDistributions({ where: whereWithUserRole }).then(setDistributions).catch(console.error);
    }, [findManyDistributions, currentUserRole, canReadCommissionDistribution, role]);

    useEffect(() => {
        if (!show) return;
        loadDistributions();
        return () => cancelFindManyDistributions();
    }, [loadDistributions, show, cancelFindManyDistributions]);

    const resetActionsAndLoadDistributions = useCallback(() => {
        setDistributionUpdating(null);
        setDistributionDeleting(null);
        loadDistributions();
    }, [loadDistributions]);

    return (
        <>
            <Offcanvas.Root onHide={onHide} show={show}>
                <Offcanvas.Header>
                    <Offcanvas.Title>Distribuições: {UserRoleUtil.getRoleDescription(role)}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-3 gap-3">
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
                    {distributions.map((distribution) => (
                        <Card>
                            <Card.Body className="p-0 pt-1">
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
                                                <td>{StringUtil.truncate(roleCommission.userRole.user.name, 25)}</td>
                                                <td className="text-end">{roleCommission.comissao} %</td>
                                                <td className="text-end">{roleCommission.acelerator} %</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="d-flex justify-content-end gap-2 p-2">
                                    <Button
                                        className={cn([!canEditCommissionDistribution({}) && "d-none"])}
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => setDistributionDeleting(distribution)}
                                    >
                                        Deletar
                                    </Button>
                                    <Button
                                        className={cn([!canDeleteCommissionDistribution({}) && "d-none"])}
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={() => setDistributionUpdating(distribution)}
                                    >
                                        Editar
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </Offcanvas.Body>
                <Offcanvas.Footer>
                    <Button variant="outline-secondary-dark" onClick={onHide}>
                        Fechar
                    </Button>
                    <Button
                        className={cn([!canAddCommissionDistribution({}) && "d-none"])}
                        onClick={() => setShowAdd(true)}
                    >
                        Adicionar
                    </Button>
                </Offcanvas.Footer>
            </Offcanvas.Root>

            <OffcanvasForm.CommissionDistribution.Delete
                distributionToDelete={distributionDeleting}
                onHide={() => setDistributionDeleting(null)}
                onDone={resetActionsAndLoadDistributions}
            />

            <OffcanvasForm.CommissionDistribution.Manage
                role={role}
                show={showAdd || !!distributionUpdating}
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
