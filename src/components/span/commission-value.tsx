import SpanCommission from "../../ui/span-component/spanCommission"; //Span genérico
import CommissionUtil from "../../utils/commission.util";
import StringUtil from "../../utils/string.util";

import { Commission } from "../../types/commission";
import { CurrencyType } from "../../types/commom";

type CommissionValueProps = { commission: Commission };

export default function CommissionValue(props: CommissionValueProps) {
    const { approvedValue, expectedValue } = CommissionUtil.getCommissionValues(props.commission);

    return (
        <SpanCommission spanTriggerContent={
                <>
                    {StringUtil.getCurrencyFormat(expectedValue, CurrencyType.BRL)} /{" "}
                    <strong>{StringUtil.getCurrencyFormat(approvedValue, CurrencyType.BRL)}</strong>
                </>
            }
            popoverHeader={
                <>
                    <i className="bi bi-cash-coin" /> Valor da Comissão
                </>
            }
        >
            <table className="table">
                <thead>
                    <tr>
                        <th>E/A</th>
                        <th className="text-end">Comissão</th>
                        <th className="text-end">Acelerador</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Esperado</td>
                        <td className="text-end">{props.commission.comissao}%</td>
                        <td className="text-end">{props.commission.acelerador}%</td>
                    </tr>
                    
                    <tr>
                        <td>Aprovado</td>
                        <td className="text-end">
                            {CommissionUtil.getCommissionValues(
                                props.commission
                            ).approvedCommission.toFixed(2) + "%"}
                        </td>
                        <td className="text-end">
                            {CommissionUtil.getCommissionValues(props.commission).approvedAccelerator.toFixed(2) + "%"}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="d-flex flex-column px-2 pb-2">
                <div className="d-flex justify-content-between">
                    Margem base:
                    <strong>
                        {StringUtil.getCurrencyFormat(
                            props.commission.valorMargemBrutaBase,
                            CurrencyType.BRL
                        )}
                    </strong>
                </div>

                <div className="d-flex justify-content-between">
                    Valor Esperado:
                    <strong>{StringUtil.getCurrencyFormat(expectedValue, CurrencyType.BRL)}</strong>{" "}
                </div>

                <div className="d-flex justify-content-between">
                    Valor Aprovado:
                    <strong>{StringUtil.getCurrencyFormat(approvedValue, CurrencyType.BRL)}</strong>{" "}
                </div>
            </div>
        </SpanCommission>
    );
}