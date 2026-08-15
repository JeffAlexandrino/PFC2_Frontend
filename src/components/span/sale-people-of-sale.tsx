import SpanSale from "../../ui/span-component/spanSale";
import FrontRoutes from "../../lib/front-routes";
import StringUtil from "../../utils/string.util";
import MyLink from "../links/MyLink";

import { ContextUser } from "../../contexts/ContextUser";
import { Sale } from "../../types/sale";
import { Stack } from "react-bootstrap";
import { useContext } from "react";

type SalePeopleOfSaleProps = { venda: Sale };

export default function SalePeopleOfSale({ venda }: SalePeopleOfSaleProps) {
    const { canReadUserRoles: podeVisualizarUserRoles } = useContext(ContextUser);

    const salePeople = [venda.accountManager, venda.insideSales].filter((userRole) => userRole !== null);
    const namesOfSalePerson = salePeople.map(({ user }) => StringUtil.getFirstName(user.name));
    const firstName = namesOfSalePerson.at(0);
    const hasNoPeople = salePeople.length === 0;
    const textSpan = hasNoPeople
        ? "Nenhum vendedor"
        : salePeople.length < 2
          ? firstName
          : `${firstName}, +${namesOfSalePerson.length - 1}`;

    return (
        <SpanSale
            spanTriggerContent={
                <>
                    <i className="bi bi-people" /> <span>{textSpan}</span>
                </>
            }
            popoverHeader={
                <>
                    <i className="bi bi-person-square me-2" />
                    Vendedores
                </>
            }
        >
            {hasNoPeople ? (
                <div className="p-2 text-center fw-semibold">Nenhum vendedor selecionado</div>
            ) : (
                <table className="table table-hover mb-0">
                    <tbody>
                        {venda.accountManager && (
                            <tr>
                                <td className="text-center">AM</td>
                                <td>
                                    <Stack>
                                        <span>
                                            <i className="bi bi-person-fill me-2" />
                                            {podeVisualizarUserRoles({ id: venda.accountManager.id }) ? (
                                                <MyLink
                                                    to={FrontRoutes.getTargetsUser(venda.accountManager.user.id)}
                                                >
                                                    {venda.accountManager.user.name}
                                                </MyLink>
                                            ) : (
                                                venda.accountManager.user.name
                                            )}
                                        </span>

                                        <div className="text-secondary-dark d-flex align-items-center gap-2">
                                            <i className="bi bi-envelope-fill" />
                                            {venda.accountManager.user.email}
                                        </div>
                                    </Stack>
                                </td>
                            </tr>
                        )}

                        {venda.insideSales && (
                            <tr>
                                <td className="text-center">IS</td>
                                <td>
                                    <Stack>
                                        <span>
                                            <i className="bi bi-person-fill me-2" />
                                            {podeVisualizarUserRoles({ id: venda.insideSales.id }) ? (
                                                <MyLink to={FrontRoutes.getTargetsUser(venda.insideSales.user.id)}>
                                                    {venda.insideSales.user.name}
                                                </MyLink>
                                            ) : (
                                                venda.insideSales.user.name
                                            )}
                                        </span>
                                        <span className="text-secondary-dark">
                                            <i className="bi bi-envelope-fill me-2" />
                                            {venda.insideSales.user.email}
                                        </span>
                                    </Stack>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </SpanSale>
    );
}