import SpanSpan from "../../ui/span-component/spanSpan"; // Span Genérico
import utils from "../../utils";
import "./styles.css";

import { CurrencyType } from "../../types/commom";
import { useCallback, useState } from "react";
import { Visit } from "../../types/visits";

interface SpanVisitaGastoProps {
    visita: Visit;
}

export default function VisitSpent({ visita }: SpanVisitaGastoProps) {
    const [mostrarInfo, setMostrarInfo] = useState(false);

    const retornaValorTotalGasto = useCallback(() => {
        return visita.gastos.reduce((acc, gasto) => acc + gasto.valor, 0);
    }, [visita]);

    const handleOnMostrarInfo = useCallback(() => setMostrarInfo(true), []);

    return (
        <SpanSpan
            spanTriggerContent={
                <div className="my-container-controle-borda p-2" onClick={handleOnMostrarInfo}>
                    {visita.gastos.length < 1 && <div>Nenhum gasto</div>}
                    {visita.gastos.length > 0 && (
                        <span className="d-flex w-100 overflow-hidden text-info justify-content-end">
                            {utils.retornaValorMonetario(retornaValorTotalGasto(), CurrencyType.BRL)}
                        </span>
                    )}
                </div>
            }
            popoverHeader={
                <>
                    <i className="bi bi-cash-stack"></i> Informações
                </>
            }
        >
            {mostrarInfo &&
                (visita.gastos.length === 0 ? (
                    <div className="p-2 text-center fw-semibold" style={{ minWidth: "175px" }}>
                        Nenhum gasto registrado.
                    </div>
                ) : (
                    visita.gastos.map((gasto, index) => (
                        <div key={index} className="p-2 border-bottom" style={{ minWidth: "175px" }}>
                            <div className="text-start fs-6 fw-bold">{utils.returnTextTipoGasto(gasto.tipoGasto)}</div>

                            <div className="d-flex justify-content-between align-items-end lh-1 mt-1">
                                <span>Nota:</span>
                                <span>{gasto.nota ?? "---"}</span>
                            </div>

                            <div className="d-flex justify-content-between align-items-end lh-1 mt-1">
                                <span>Valor: </span>
                                <span>{utils.retornaValorMonetario(gasto.valor, CurrencyType.BRL)}</span>
                            </div>
                        </div>
                    ))
                ))}
        </SpanSpan>
    );
}
