import SaleInvoiceUtil from "../../utils/sale-invoice.util";
import SpanSale from "../../ui/span-component/spanSale";
import utils from "../../utils";

import { Commission } from "../../types/commission";
import { CurrencyType } from "../../types/commom";
import { Stack } from "react-bootstrap";
import "./styles.css";

export default function CommissionSaleInvoice({ commission }: { commission: Commission[] }) {
    const firstInvoiceCode = commission.at(0)?.notaVenda.codigo ?? SaleInvoiceUtil.NO_INVOICE_CODE;

    return (
        <SpanSale
            spanTriggerContent={firstInvoiceCode}
            popoverHeader={
                <>
                    <i className="bi bi-file-earmark-text"></i> Nota Fiscal da Venda
                </>
            }
            spanIcon="bi bi-receipt"
        >
            <div style={{ minWidth: "240px" }}>
                {commission.map(({ notaVenda }) => (
                    <Stack
                        key={notaVenda.id}
                        className="invoice-section w-100 p-1 border-bottom gap-0.5 border rounded"
                    >
                        <div className="d-flex justify-content-between">
                            Nota fiscal:
                            <span className="fw-bold text-primary text-center">
                                {notaVenda.codigo ?? SaleInvoiceUtil.NO_INVOICE_CODE}
                            </span>
                        </div>
                        {[
                            // ["Forma de pgto.", `${notaVenda.formaPagamentoId}`], //TODO: ver uma forma de puxar a string sem quebrar os testes do cypress
                            ["Data da venda", notaVenda.dataFaturamento.toLocaleDateString("pt-BR")],
                            ["Núm. parcelas", `${notaVenda.formaParcelamento}x`],
                        ].map(([label, value], i) => (
                            <div key={i} className="d-flex justify-content-between">
                                <span>{label}:</span>
                                <span className="fw-bold">
                                    {typeof value === "string"
                                        ? value
                                        : utils.retornaValorMonetario(value, CurrencyType.BRL)}
                                </span>
                            </div>
                        ))}
                    </Stack>
                ))}
            </div>
        </SpanSale>
    );
}
