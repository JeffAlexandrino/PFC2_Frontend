import { useCallback, useMemo, useState } from "react";
import { Visit, ExpenseType } from "../../types/visits";

import SpanSpan from "../../ui/span-component/spanSpan";
import "./styles.css";

interface SpanVisitaKilometragemProps {
    visita: Visit;
}

export default function VisitKm({ visita }: SpanVisitaKilometragemProps) {
    const [mostrarInfo, setMostrarInfo] = useState(false);

    const gastosCombustivel = useMemo(() => {
        return visita.gastos.filter(
            (gasto) => gasto.tipoGasto === ExpenseType.COMBUSTIVEL && gasto.kmInicial !== null && gasto.kmFinal !== null
        );
    }, [visita.gastos]);

    const kmTotal = useMemo(() => {
        return gastosCombustivel.reduce((acc, gasto) => {
            const km = (gasto.kmFinal as number) - (gasto.kmInicial as number);
            return acc + (km > 0 ? km : 0);
        }, 0);
    }, [gastosCombustivel]);

    const handleOnMostrarInfo = useCallback(() => setMostrarInfo(true), []);

    return (
        <SpanSpan
            spanTriggerContent={
                <span
                    className="d-flex align-items-center justify-content-end text-nowrap"
                    onClick={handleOnMostrarInfo}
                >
                    {kmTotal === 0 ? "Sem registro" : `${kmTotal} km`}
                </span>
            }
            popoverHeader={
                <>
                    <i className="bi bi-speedometer"></i> Kilometragem
                </>
            }
        >
            {mostrarInfo &&
                (gastosCombustivel.length === 0 ? (
                    <div className="p-2 text-center fw-semibold" style={{ minWidth: "175px" }}>
                        Kilometragem não registrada.
                    </div>
                ) : (
                    <>
                        {gastosCombustivel.map((gasto, index) => {
                            return (
                                <div key={index} className="mb-1" style={{ minWidth: "200px" }}>
                                    <div className="d-flex justify-content-between align-items-end lh-1 mt-1 ">
                                        <span>Km Final:</span>
                                        <span>{gasto.kmFinal} km</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-end lh-1 mt-1 border-bottom pb-2">
                                        <span>Km Inicial:</span>
                                        <span>{gasto.kmInicial} km</span>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="d-flex justify-content-between align-items-end lh-1 mt-1 fw-bold ">
                            <span>Km Rodados:</span>
                            <span>{kmTotal} km</span>
                        </div>
                    </>
                ))}
        </SpanSpan>
    );
}
