import CommissionUtil from "../../utils/commission.util";
import SpanSale from "../../ui/span-component/spanSale"; //Span genérico
import StringUtil from "../../utils/string.util";
import popover from "../../ui/popover";
import cn from "../../utils/cn";

import { Commission } from "../../types/commission";
import { CurrencyType } from "../../types/commom";
import { Sale } from "../../types/sale";
import { Stack } from "react-bootstrap";
import { User } from "../../types/user";

type SaleCommissionsProps = { sale: Sale };

export default function SaleCommissions({ sale }: SaleCommissionsProps) {
    const userRoles = [
        sale.accountManager,
        sale.insideSales,
        sale.comercialAssistant,
        sale.comercialManager,
        sale.solutionArchitect,
        sale.referrer,
    ];
    const definedUserRoles = userRoles.filter((user) => user !== null);

    const userRolesWithCommissions: {
        user: Omit<User, "userRoles">;
        comissoes: Omit<Commission, "userRole" | "venda" | "notaVenda">[];
        expectedValue: number;
        approvedValue: number;
    }[] = [];

    sale.notasVenda.forEach(({ comissoes }) =>
        comissoes.forEach((commission) => {
            const { expectedValue, approvedValue } = CommissionUtil.getCommissionValues(commission);

            const userRole = definedUserRoles.find((userRole) => userRole.id === commission.userRoleId);
            if (!userRole) return;

            const idxUserRoleWithCommissions = userRolesWithCommissions.findIndex(
                ({ user }) => user.id === userRole.userId
            );

            if (idxUserRoleWithCommissions === -1)
                return userRolesWithCommissions.push({
                    user: userRole.user,
                    comissoes: [commission],
                    expectedValue: expectedValue,
                    approvedValue: approvedValue,
                });

            userRolesWithCommissions[idxUserRoleWithCommissions].expectedValue += expectedValue;
            userRolesWithCommissions[idxUserRoleWithCommissions].approvedValue += approvedValue;
            userRolesWithCommissions[idxUserRoleWithCommissions].comissoes.push(commission);
        })
    );

    return (
        <SpanSale
            spanTriggerContent={
                <>
                    <i className="bi bi-card-checklist" /> Visualizar
                </>
            }
            popoverHeader={
                <>
                    <i className="bi bi-cash-coin" /> Comissões da Venda
                </>
            }
        >
            <popover.Body className="p-2 gap-2">
                {userRolesWithCommissions.map((salePersonWithCommissions) => (
                    <Stack className="border rounded pt-2 pb-2" key={salePersonWithCommissions.user.id}>
                        <span className="px-2 text-primary text-center">
                            <strong>{salePersonWithCommissions.user.name}</strong>
                        </span>

                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th />
                                    <th>Data</th>
                                    <th>Valor</th>
                                    <th>%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salePersonWithCommissions.comissoes.map((commission) => {
                                    const commissionValue = CommissionUtil.getCommissionValues(commission);
                                    return (
                                        <tr key={commission.id}>
                                            <td>
                                                <i
                                                    className={cn([
                                                        "bi bi-check-circle-fill text-secondary",
                                                        commission.comissaoPaga && "text-success",
                                                    ])}
                                                />
                                            </td>
                                            <td>{commission.dataComissao.toLocaleDateString("pt-Br")}</td>
                                            <td>
                                                <span>
                                                    {StringUtil.getCurrencyFormat(
                                                        commissionValue.expectedValue,
                                                        CurrencyType.BRL
                                                    )}
                                                </span>
                                            </td>
                                            <td>{commission.comissao}%</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="d-flex justify-content-between px-2">
                            <span>Valor esperado:</span>
                            <strong>
                                {StringUtil.getCurrencyFormat(
                                    salePersonWithCommissions.expectedValue,
                                    CurrencyType.BRL
                                )}
                            </strong>
                        </div>
                        <div className="d-flex justify-content-between px-2">
                            <span>Valor aprovado:</span>
                            <strong>
                                {StringUtil.getCurrencyFormat(
                                    salePersonWithCommissions.approvedValue,
                                    CurrencyType.BRL
                                )}
                            </strong>
                        </div>
                    </Stack>
                ))}
            </popover.Body>
        </SpanSale>
    );
}
