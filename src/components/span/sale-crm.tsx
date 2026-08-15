import SaleInvoiceUtil from "../../utils/sale-invoice.util";
import SpanSale from "../../ui/span-component/spanSale";

import { SaleInvoice } from "../../types/sale-invoice";
import { Stack } from "react-bootstrap";

import "./styles.css";

type SaleNumberCRMProps = {
    saleInvoices: SaleInvoice[];
};

export default function SaleNumCRM({ saleInvoices }: SaleNumberCRMProps) {
    const firstCRM = saleInvoices.find(({ numOportunidadeCRM }) => numOportunidadeCRM)?.numOportunidadeCRM ?? "-";
    const spanText = saleInvoices.length > 1 ? `${firstCRM}, ...` : firstCRM;

    return (
        <SpanSale
            spanTriggerContent={spanText}
            spanIcon="bi bi-file-earmark-check"
            popoverHeader={
                <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-receipt-cutoff" />
                    <span>Núm. de Oportunidade CRM</span>
                </div>
            }
        >
            <div>
                {saleInvoices.map((invoice) => (
                    <Stack key={invoice.id} className="invoice-section w-100 mb-2 p-2 border rounded">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold">Nota fiscal:</span>
                            <span className="fw-bold text-center">
                                {invoice.codigo ?? SaleInvoiceUtil.NO_INVOICE_CODE}
                            </span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold">Número CRM:</span>
                            <span className="fw-bold text-primary text-center">{invoice.numOportunidadeCRM}</span>
                        </div>
                    </Stack>
                ))}
            </div>
        </SpanSale>
    );
}
