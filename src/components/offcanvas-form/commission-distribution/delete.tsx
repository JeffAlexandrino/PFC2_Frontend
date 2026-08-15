import useCommissionDistribution from "../../../hooks/use-commission-distribution";

import { CommissionDistribution } from "../../../types/commission-distribution";
import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { useCallback } from "react";

type DeleteDistributionProps = {
    onHide?: () => void;
    onDone?: () => void;
    distributionToDelete?: CommissionDistribution | null;
};

export default function Delete({ onHide, onDone, ...props }: DeleteDistributionProps) {
    const { deleteDistribution, cancelDeleteDistribution, deletingDistribution } = useCommissionDistribution();

    const handleOnClose = useCallback(() => {
        cancelDeleteDistribution();
        if (onHide) onHide();
    }, [onHide, cancelDeleteDistribution]);

    const handleOnDelete = useCallback(() => {
        deleteDistribution(props.distributionToDelete?.id ?? "")
            .then(onDone)
            .catch(console.error);
    }, [deleteDistribution, onDone, props.distributionToDelete?.id]);

    return (
        <OffcanvasForm.Root show={!!props.distributionToDelete} onHide={handleOnClose}>
            <OffcanvasForm.Header>
                <OffcanvasForm.Title>Deletar Distribuição</OffcanvasForm.Title>
            </OffcanvasForm.Header>

            <OffcanvasForm.Body>
                <OffcanvasForm.WarningMessage className="d-flex h-100 w-100">
                    <p>
                        A distribuição com os usuários{" "}
                        <strong>
                            {props.distributionToDelete?.roleCommissions
                                .map(({ userRole }) => userRole.user.name)
                                .join(", ")}
                        </strong>{" "}
                        será deletada. Clique em <strong>deletar</strong> para confirmar.
                    </p>
                </OffcanvasForm.WarningMessage>
                <OffcanvasForm.Footer>
                    <OffcanvasForm.Reset onClick={onHide}>Cancelar</OffcanvasForm.Reset>
                    <OffcanvasForm.Submit
                        onClick={handleOnDelete}
                        pending={deletingDistribution}
                        variant="danger"
                        className="text-white"
                    >
                        Deletar
                    </OffcanvasForm.Submit>
                </OffcanvasForm.Footer>
            </OffcanvasForm.Body>
        </OffcanvasForm.Root>
    );
}
