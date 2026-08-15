import { TotalValueDashboardCardProps } from "../../types";
import { CurrencyType } from "../../../../types/commom";

import utils from "../../../../utils";

import "./style.css";

export default function GastoComClientes(props: TotalValueDashboardCardProps) {
    const valorDespesaDeSaida = utils.retornaValorMonetario(props.valorGasto, CurrencyType.BRL);

    return (
        <div className="despesa-saida-card position-relative overflow-hidden">
            <div className="d-flex flex-column h-100 justify-content-between position-relative">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <span className="total-value-title d-flex flex-column">Despesa de Saída</span>
                        <small className="total-value-spam">Valor total de despesas com as saídas</small>
                    </div>

                    <div className="total-value-icon d-flex align-items-center justify-content-center">
                        <i className="bi bi-receipt" />
                    </div>
                </div>

                <div className="mt-4">
                    <h2 className="total-value-value fw-bold mb-2">{valorDespesaDeSaida}</h2>
                </div>
            </div>
        </div>
    );
}
