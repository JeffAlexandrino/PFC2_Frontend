import SpanSale from "../../ui/span-component/spanSale"; //Span genérico
import utils from "../../utils";

import { CurrencyType } from "../../types/commom";
import { Sale } from "../../types/sale";

interface ISpanVendaValorProps {
    venda: Sale;
}

export default function SaleValues({ venda }: ISpanVendaValorProps) {
    return (
        <SpanSale
            spanTriggerContent={
                <span className="d-flex align-items-center justify-content-end text-nowrap">
                    {utils.retornaValorMonetario(venda.valorVenda, CurrencyType.BRL)}
                </span>
            }
            popoverHeader={
                <>
                    <i className="bi bi-coin"></i> Valores da Venda
                </>
            }
        >
            <div style={{ minWidth: "250px" }}>
                <div className="mb-2 p-2 border rounded">
                    <div className="d-flex justify-content-between lh-1">
                        <span>Custo Total:</span>
                        <span>{utils.retornaValorMonetario(venda.valorCusto, CurrencyType.BRL)}</span>
                    </div>
                    <div className="d-flex justify-content-between lh-1 border-bottom pb-2">
                        <span>+ Markup Bruto:</span>
                        <span>{utils.retornaValorMonetario(venda.valorMarkup ?? 0, CurrencyType.BRL)}</span>
                    </div>
                    <div className="d-flex justify-content-between mt-1 fw-bold lh-1">
                        <span>= Valor Venda:</span>
                        <span>{utils.retornaValorMonetario(venda.valorVenda ?? 0, CurrencyType.BRL)}</span>
                    </div>
                </div>

                <div className="mb-2 p-2 border rounded">
                    <div className="d-flex justify-content-between lh-1 mt-1">
                        <span>Markup Bruto:</span>
                        <span>{utils.retornaValorMonetario(venda.valorMarkup, CurrencyType.BRL)}</span>
                    </div>
                    <div className="d-flex justify-content-between lh-1 mt-1 border-bottom pb-2">
                        <span>- Impostos:</span>
                        <span>{utils.retornaValorMonetario(venda.valorImpostos, CurrencyType.BRL)}</span>
                    </div>
                    <div className="d-flex justify-content-between lh-1 mt-1 fw-bold">
                        <span>= Margem Bruta:</span>
                        <span>{utils.retornaValorMonetario(venda.valorMargemBruta, CurrencyType.BRL)}</span>
                    </div>
                </div>

                <div className="mb-2 p-2 border rounded">
                    <div className="d-flex justify-content-between lh-1 mt-1">
                        <span>Markup Bruto:</span>
                        <span>{utils.retornaValorMonetario(venda.valorMarkup, CurrencyType.BRL)}</span>
                    </div>
                    <div className="d-flex justify-content-between lh-1 mt-1 border-bottom pb-2">
                        <span>- Dedutíveis Distri.:</span>
                        <span>{utils.retornaValorMonetario(venda.valorDedutiveisDistribuidor, CurrencyType.BRL)}</span>
                    </div>
                    <div className="d-flex justify-content-between lh-1 mt-1 fw-bold">
                        <span>= Markup Líquido:</span>
                        <span>{utils.retornaValorMonetario(venda.valorMarkupLiquido, CurrencyType.BRL)}</span>
                    </div>
                </div>
            </div>
        </SpanSale>
    );
}
