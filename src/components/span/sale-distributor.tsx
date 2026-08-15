import SaleInvoiceUtil from "../../utils/sale-invoice.util";
import SpanSale from "../../ui/span-component/spanSale";

import { SaleInvoice } from "../../types/sale-invoice";
import { Stack } from "react-bootstrap";

import "./styles.css";

type SaleNumberDistributorProps = {
    saleInvoices: SaleInvoice[];
};

export default function SaleNumDistributor({ saleInvoices }: SaleNumberDistributorProps) {
    const firstDistribuidor =
        saleInvoices.find(({ numPedidoDistribuidor }) => numPedidoDistribuidor)?.numPedidoDistribuidor ?? "-";
    const spanText = saleInvoices.length > 1 ? `${firstDistribuidor}, ...` : firstDistribuidor;

    return (
        <SpanSale
            spanTriggerContent={spanText}
            spanIcon="bi bi-box-seam"
            popoverHeader={
                <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-truck" />
                    <span>Núm. de Pedido do Distribuidor</span>
                </div>
            }
        >
            <div>
                {saleInvoices.map((invoice) => (
                    <Stack key={invoice.id} className="invoice-section w-80 mb-2 p-2 border rounded">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold">Nota fiscal:</span>
                            <span className="fw-bold text-center">
                                {invoice.codigo ?? SaleInvoiceUtil.NO_INVOICE_CODE}
                            </span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold">Núm. Distribuidor:</span>
                            <span className="fw-bold text-primary text-center">{invoice.numPedidoDistribuidor}</span>
                        </div>
                    </Stack>
                ))}
            </div>
        </SpanSale>
    );
}
