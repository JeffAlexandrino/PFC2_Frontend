import SpanSale from "../../ui/span-component/spanSale"; //Span genérico
import utils from "../../utils";

import { CurrencyType } from "../../types/commom";
import { Sale } from "../../types/sale";

interface ISpanVendaImpostoProps {
    venda: Sale;
}

export default function SaleTax({ venda }: ISpanVendaImpostoProps) {
    return (
        <SpanSale
            spanTriggerContent={
                <span className="d-flex align-items-center justify-content-end text-nowrap">
                    {utils.retornaValorMonetario(venda.valorImpostos, CurrencyType.BRL)}
                </span>
            }
            popoverHeader={
                <>
                    <i className="bi bi-cash"></i> Impostos das Notas
                </>
            }
        >
            <div style={{ minWidth: "240px" }}>
                {venda.notasVenda?.map((nota) => (
                    <div key={nota.id} className="mb-2 p-2 border rounded">
                        <div className="fw-bold text-truncate">Nota: {nota.codigo}</div>
                        <div className="d-flex justify-content-between">
                            <span>Imposto da Nota:</span>
                            <span>{utils.retornaValorMonetario(nota.valorImpostoNota, CurrencyType.BRL)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>+ Dedutíveis distri.:</span>
                            <span>
                                {utils.retornaValorMonetario(nota.valorDedutiveisDistribuidor, CurrencyType.BRL)}
                            </span>
                        </div>
                    </div>
                ))}

                <div className="border-top pt-2 mt-2 d-flex justify-content-between fw-bold">
                    <span>Totais:</span>
                    <span>{utils.retornaValorMonetario(venda.valorImpostos, CurrencyType.BRL)}</span>
                </div>
            </div>
        </SpanSale>
    );
}
