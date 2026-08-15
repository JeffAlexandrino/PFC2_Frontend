import SaleInvoiceUtil from "../../utils/sale-invoice.util";
import SpanSale from "../../ui/span-component/spanSale"; //Span genérico

import { SaleInvoice } from "../../types/sale-invoice";

type SaleInvoiceRevenueProps = { invoices: SaleInvoice[] };

export default function SaleInvoiceRevenueDates({ invoices }: SaleInvoiceRevenueProps) {
    const firstDateStr = invoices.at(0)?.dataFaturamento.toLocaleDateString("pt-BR") ?? "--/--/----";
    const spanText = firstDateStr + (invoices.length > 1 ? `, ...` : "");

    return (
        <SpanSale
            spanTriggerContent={
                <>
                    <i className="bi bi-calendar-range" /> {spanText}
                </>
            }
            popoverHeader={
                <>
                    <i className="bi bi-calendar-check"></i> Faturamento das NFs
                </>
            }
        >
            {invoices.map((invoice, i) => (
                <table key={`produto-${i}`} className="table table-hover mb-1 border rounded overflow-hidden no-scroll">
                    <thead className="bg-light">
                        <tr>
                            <th colSpan={2} className="text-center">
                                {invoice.codigo ?? SaleInvoiceUtil.NO_INVOICE_CODE}
                            </th>
                        </tr>
                        <tr>
                            <th>Data da Fatura</th>
                            <th className="text-end">Boleto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.datasBoleto.map((boleto, index) => (
                            <tr key={boleto.id}>
                                <td>{new Date(boleto.data).toLocaleDateString("pt-BR")}</td>
                                <td className="text-end">#{index + 1}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ))}
        </SpanSale>
    );
}
