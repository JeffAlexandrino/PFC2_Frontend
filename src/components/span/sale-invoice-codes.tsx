import SaleInvoiceUtil from "../../utils/sale-invoice.util";
import SpanSale from "../../ui/span-component/spanSale"; //Spam genérico
import utils from "../../utils";
import "./styles.css";

import { SaleInvoice } from "../../types/sale-invoice";
import { CurrencyType } from "../../types/commom";
import { Row, Stack } from "react-bootstrap";

type SaleInvoiceCodesProps = { saleInvoices: SaleInvoice[] };

export default function SaleInvoiceCodes({ saleInvoices }: SaleInvoiceCodesProps) {
    const firstInvoiceCode = saleInvoices.find(({ codigo }) => !!codigo)?.codigo ?? SaleInvoiceUtil.NO_INVOICE_CODE;
    const spanText = firstInvoiceCode + (saleInvoices.length > 1 ? `, ...` : "");

    return (
        <SpanSale
            spanTriggerContent={spanText}
            popoverHeader={
                <>
                    <i className="bi bi-receipt"></i> Notas Fiscais da Venda
                </>
            }
            spanIcon="bi bi-receipt"
        >
            <div style={{ maxWidth: "230px" }}>
                {saleInvoices.map((invoice) => (
                    <Stack
                        key={invoice.id}
                        className="invoice-section w-100 mb-1 p-1 border-bottom gap-0.5 border rounded"
                    >
                        <div className="d-flex justify-content-between fw-bold">
                            Nota fiscal:
                            <span className="fw-bold text-primary text-center">
                                {invoice.codigo ?? SaleInvoiceUtil.NO_INVOICE_CODE}
                            </span>
                        </div>

                        <span className="text-secondary-dark small text-end">Resumo da nota</span>
                        {[
                            ["Custo total", invoice.valorCusto],
                            ["Markup bruto", invoice.valorMarkup],
                            ["Markup líquido", invoice.valorMarkupLiquido],
                            ["Valor de venda", invoice.valorVenda],
                            ["Impostos totais", invoice.valorImpostos],
                            ["Margem bruta", invoice.valorMargemBruta],
                            ["Núm. parcelas", `${invoice.formaParcelamento}x`],
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

                        <span className="text-secondary-dark small text-end">Produtos na nota</span>
                        {(invoice.vendasProduto?.length ?? 0) < 1 && (
                            <span className="text-center">--- Nenhum produto ---</span>
                        )}
                        {invoice.vendasProduto?.map((p) => (
                            <Row key={p.produtoId} className="my-1">
                                <span className="text-center fw-bold">{p.produto.name}</span>
                                {[
                                    ["Tipo fat.", p.tipoFaturamento],
                                    ["Custo unit.", utils.retornaValorMonetario(p.valorCustoUnit, p.tipoMoeda)],
                                    ["Qntd.", `${p.quantidade} un`],
                                    ...(p.tipoMoeda === CurrencyType.USD
                                        ? [["Cotação", utils.retornaValorMonetario(p.cotacao, CurrencyType.BRL)]]
                                        : []),
                                    ["Custo Total", utils.retornaValorMonetario(p.valorCusto, CurrencyType.BRL)],
                                    ["Markup", utils.retornaValorMonetario(p.valorMarkup, CurrencyType.BRL)],
                                    ["Valor venda", utils.retornaValorMonetario(p.valorVenda, CurrencyType.BRL)],
                                    ["Impostos", utils.retornaValorMonetario(p.valorImpostos, CurrencyType.BRL)],
                                    ["Margem", utils.retornaValorMonetario(p.valorMargem, CurrencyType.BRL)],
                                ].map(([label, value], i) => (
                                    <div key={i} className="d-flex justify-content-between">
                                        <span>{label}:</span>
                                        <span className="fw-bold">{value}</span>
                                    </div>
                                ))}
                            </Row>
                        ))}

                        <span className="text-secondary-dark small text-end">Serviços na nota</span>
                        {(invoice.vendasServico?.length ?? 0) < 1 && (
                            <span className="text-center">--- Nenhum serviço ---</span>
                        )}
                        {invoice.vendasServico?.map((s) => (
                            <Row key={s.servicoId} className="my-1">
                                <span className="text-center fw-bold">{s.servico.name}</span>
                                {[
                                    ["Tipo fat.", s.tipoFaturamento],
                                    ["Valor custo hora", utils.retornaValorMonetario(s.valorCustoHora, s.tipoMoeda)],
                                    ["Hora comerc.", `${s.qntdHorasComercial} h`],
                                    ["Hora n/ comerc.", `${s.qntdHorasNaoComercial} h`],
                                    ["Hora especial.", `${s.qntdHorasEspecial} h`],
                                    ...(s.tipoMoeda === CurrencyType.USD
                                        ? [["Cotação", utils.retornaValorMonetario(s.cotacao, CurrencyType.BRL)]]
                                        : []),
                                    ["Custo Total", utils.retornaValorMonetario(s.valorCusto, CurrencyType.BRL)],
                                    ["Markup", utils.retornaValorMonetario(s.valorMarkup, CurrencyType.BRL)],
                                    ["Valor venda", utils.retornaValorMonetario(s.valorVenda, CurrencyType.BRL)],
                                    ["Impostos", utils.retornaValorMonetario(s.valorImpostos, CurrencyType.BRL)],
                                    ["Margem", utils.retornaValorMonetario(s.valorMargem, CurrencyType.BRL)],
                                ].map(([label, value], i) => (
                                    <div key={i} className="d-flex justify-content-between">
                                        <span>{label}:</span>
                                        <span className="fw-bold">{value}</span>
                                    </div>
                                ))}
                            </Row>
                        ))}
                    </Stack>
                ))}
            </div>
        </SpanSale>
    );
}
