import useCommission from "../../hooks/use-commission";
import StringUtil from "../../utils/string.util";
import Modal from "../../ui/modal";

import { useCallback, useContext, useEffect, useState } from "react";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { Commission } from "../../types/commission";
import { CurrencyType } from "../../types/commom";
import { Button } from "react-bootstrap";

type ToggleMarkCommissionDistributorPaidProps = {
    commission?: Commission | null;
    onDone?: () => void;
    onCancel?: () => void;
};

export default function ToggleCommissionDistributorPaid({
    commission,
    onCancel,
    onDone,
}: ToggleMarkCommissionDistributorPaidProps) {
    const { setProcessando } = useContext(ContextAlerta);

    const { toggleCommissionDistributorPaid, cancelToggleCommissionDistributorPaid } = useCommission();
    const { findManyCommissions, findingCommissions } = useCommission();

    const [otherCommissions, setOtherCommissions] = useState<Commission[]>([]);

    const loadOtherCommissions = useCallback(() => {
        if (!commission) return;

        findManyCommissions({
            where: {
                saleInvoiceId: commission.notaVenda.id,
                gte_dataComissao: commission.dataComissao.toISOString(),
                lte_dataComissao: commission.dataComissao.toISOString(),
            },
        })
            .then(setOtherCommissions)
            .catch(console.error);
    }, [commission, findManyCommissions]);

    useEffect(() => {
        loadOtherCommissions();
    }, [commission, loadOtherCommissions]);

    const handleOnToggleDistributorPaid = useCallback(() => {
        if (!commission) return;

        setProcessando(true);
        toggleCommissionDistributorPaid({
            commissionDate: commission.dataComissao,
            saleInvoiceId: commission.notaVenda.id,
        })
            .then(onDone)
            .finally(() => setProcessando(false));
    }, [commission, onDone, setProcessando, toggleCommissionDistributorPaid]);

    const handleOnCancel = useCallback(() => {
        cancelToggleCommissionDistributorPaid();
        onCancel?.();
    }, [onCancel, cancelToggleCommissionDistributorPaid]);

    return (
        <Modal.Root size="lg" show={!!commission} onHide={handleOnCancel}>
            <Modal.Header>
                <Modal.Title>
                    {commission?.distributorPaid ? "Não pagas pelo distribuidor" : "Pagas pelo distribuidor"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body loading={findingCommissions}>
                <Modal.Description>
                    As seguintes comissões serão atualizadas pois são da mesma nota fiscal e possuem a mesma data.
                </Modal.Description>

                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Nota Fiscal</th>
                            <th>Data da comissão</th>
                            <th>Usuário</th>
                            <th>Margem bruta base</th>
                        </tr>
                    </thead>
                    <tbody>
                        {otherCommissions.map((c) => (
                            <tr key={c.id}>
                                <td>{c.notaVenda.codigo}</td>
                                <td>{c.dataComissao.toLocaleDateString("pt-Br")}</td>
                                <td>{c.userRole.user.name}</td>
                                <td>{StringUtil.getCurrencyFormat(c.valorMargemBrutaBase, CurrencyType.BRL)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleOnCancel} variant="outline-secondary-dark">
                    Cancelar
                </Button>
                <Button onClick={handleOnToggleDistributorPaid} variant={commission?.distributorPaid ? "danger" : "primary"}>
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal.Root>
    );
}
