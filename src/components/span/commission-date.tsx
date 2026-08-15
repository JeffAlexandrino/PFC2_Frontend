import SpanCommission from "../../ui/span-component/spanCommission"; //Span genérico
import cn from "../../utils/cn";

import { Commission } from "../../types/commission";

export default function CommissionDate({ commission }: { commission: Commission }) {
    const allCommissionsSameUser = commission.notaVenda.comissoes.filter((c) => c.userRoleId === commission.userRoleId);
    const currentCommissionIndex = allCommissionsSameUser.findIndex((c) => c.id === commission.id);

    return (
        <SpanCommission spanTriggerContent={
                <>
                    {commission.dataComissao.toLocaleDateString("pt-Br")} - {" "}
                    <strong>{(currentCommissionIndex + 1).toLocaleString("pt-Br", { minimumIntegerDigits: 2 })}</strong>
                </>
            }
            spanIcon="bi bi-calendar-event"
            popoverHeader={
                <><i className="bi bi-clock-history" /> Histórico</>
            }>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Boleto</th>
                        <th>Data</th>
                        <th className="text-end">Pago</th>
                    </tr>
                </thead>
                <tbody>
                    {allCommissionsSameUser.map((c, index) => {
                        const currentCommissionClass = cn([c.id === commission.id && "bg-info bg-opacity-25"]);

                        return (
                            <tr key={c.id}>
                                <td className={currentCommissionClass}>{index + 1}</td>
                                <td className={currentCommissionClass}>{c.dataComissao.toLocaleDateString("pt-Br")}</td>
                                <td className={currentCommissionClass + " text-end"}>
                                    {c.comissaoPaga ? (
                                        <i
                                            aria-label="Comissão paga"
                                            className="bi bi-check-circle-fill text-success"
                                        />
                                    ) : (
                                        <i
                                            aria-label="Comissão não paga"
                                            className="bi bi-dash-circle text-secondary-dark"
                                        />
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table> 
        </SpanCommission>
    );
}
