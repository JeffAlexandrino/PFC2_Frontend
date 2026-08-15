import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { Sale } from "../../../types/sale";
import { useCallback } from "react";

import useSale from "../../../hooks/use-sale";

type DeleteSaleProps = {
    onHide?: () => void;
    onDone?: () => void;
    saleToDelete?: Sale | null;
};

export default function Delete({ onHide, onDone, saleToDelete }: DeleteSaleProps) {
    const { deleteSale, cancelDeleteSale, deletingSale } = useSale();

    const handleOnClose = useCallback(() => {
        cancelDeleteSale();
        onHide?.();
    }, [onHide, cancelDeleteSale]);

    const handleOnDelete = useCallback(() => {
        if (!saleToDelete) return;

        deleteSale(saleToDelete.id ?? "", {
            estadoVendaAtual: saleToDelete.estadoVenda,
            accountManagerIdAtual: saleToDelete.accountManagerId ?? undefined,
            insideSalesIdAtual: saleToDelete.insideSalesId ?? undefined,
        })
            .then(onDone)
            .catch(console.error);
    }, [deleteSale, onDone, saleToDelete]);

    return (
        <OffcanvasForm.Root show={!!saleToDelete} onHide={handleOnClose}>
            <OffcanvasForm.Header>
                <OffcanvasForm.Title>Deletar Venda</OffcanvasForm.Title>
            </OffcanvasForm.Header>

            <OffcanvasForm.Body>
                <OffcanvasForm.WarningMessage className="d-flex flex-column gap-2 h-100 w-100">
                    <p className="mb-1">
                        Você está prestes a <strong>excluir permanentemente</strong> a venda realizada em:
                    </p>

                    <ul className="mb-2" style={{ lineHeight: "1.6" }}>
                        <li>
                            <strong>Data:</strong> {saleToDelete?.dataVenda.toLocaleDateString("pt-BR")}
                        </li>
                        <li>
                            <strong>Cliente:</strong> {saleToDelete?.cliente.name}
                        </li>
                        <li>
                            <strong>Valor:</strong>{" "}
                            {saleToDelete?.valorVenda.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                        </li>
                    </ul>

                    <p className="mb-0">
                        Esta ação <strong className="text-danger">não poderá ser desfeita</strong>. Clique em{" "}
                        <strong>Deletar</strong> para confirmar.
                    </p>
                </OffcanvasForm.WarningMessage>
                <OffcanvasForm.Footer>
                    <OffcanvasForm.Reset onClick={onHide}>Cancelar</OffcanvasForm.Reset>
                    <OffcanvasForm.Submit
                        onClick={handleOnDelete}
                        pending={deletingSale}
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
