import useCommission from "../../../hooks/use-commission";

import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { Commission } from "../../../types/commission";
import { useCallback } from "react";

type DisableCommissionProps = {
    onHide?: () => void;
    onDone?: () => void;
    commissionToDisable?: Commission | null;
};

export default function Disable({ onHide, onDone, commissionToDisable, ...props }: DisableCommissionProps) {
    const { disableOneCommission, disablingOneCommission, cancelDisableOneCommission } = useCommission();

    const handleOnClose = useCallback(() => {
        cancelDisableOneCommission();
        if (onHide) onHide();
    }, [onHide, cancelDisableOneCommission]);

    const handleOnDisable = useCallback(() => {
        if (!commissionToDisable) return;
        disableOneCommission(commissionToDisable.id).then(onDone).catch(console.error);
    }, [disableOneCommission, onDone, commissionToDisable]);

    return (
        <OffcanvasForm.Root show={!!commissionToDisable} onHide={handleOnClose}>
            <OffcanvasForm.Header>
                <OffcanvasForm.Title>Desativar Comissão</OffcanvasForm.Title>
            </OffcanvasForm.Header>

            <OffcanvasForm.Body>
                <OffcanvasForm.WarningMessage className="d-flex flex-column gap-2 h-100 w-100">
                    <p className="mb-1">
                        Você está prestes a <strong>desativar permanentemente</strong> a comissão:
                    </p>

                    <ul className="mb-2" style={{ lineHeight: "1.6" }}>
                        <li>
                            <strong>Data:</strong> {commissionToDisable?.dataComissao.toLocaleDateString("pt-BR")}
                        </li>
                        <li>
                            <strong>Usuário:</strong> {commissionToDisable?.userRole.user.name}
                        </li>
                        <li>
                            <strong>Função:</strong> {commissionToDisable?.userRole.role}
                        </li>
                        <li>
                            <strong>Nota Fiscal:</strong> {commissionToDisable?.notaVenda.codigo}
                        </li>
                    </ul>

                    <div className="mb-2">
                        <p className="mb-1">Esta ação resultará em:</p>
                        <ul style={{ lineHeight: "1.6", marginLeft: "1rem" }}>
                            <li>Retirar a comissão da página de comissões;</li>
                            <li>Impedir a visualização dessa comissão no sistema;</li>
                        </ul>
                    </div>

                    <p className="mb-0">
                        Esta ação <strong className="text-danger">não poderá ser desfeita</strong>. Clique em{" "}
                        <strong>Desativar</strong> para confirmar.
                    </p>
                </OffcanvasForm.WarningMessage>

                <OffcanvasForm.Footer>
                    <OffcanvasForm.Reset onClick={onHide}>Cancelar</OffcanvasForm.Reset>
                    <OffcanvasForm.Submit
                        onClick={handleOnDisable}
                        pending={disablingOneCommission}
                        variant="danger"
                        className="text-white"
                    >
                        Desativar
                    </OffcanvasForm.Submit>
                </OffcanvasForm.Footer>
            </OffcanvasForm.Body>
        </OffcanvasForm.Root>
    );
}
