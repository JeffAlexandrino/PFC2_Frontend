import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import FormGroupSelect from "../formGroups/FormGroupSelect";
import BotaoAssincrono from "../botoes/BotaoAssincrono";
import VisitUtil from "../../utils/visit.util";
import useVisit from "../../hooks/use-visit";
import Dropdown from "../../ui/dropdown";
import utils from "../../utils";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Row, Spinner, Stack } from "react-bootstrap";
import { VisitExpenseInfoPerRole } from "../../types/visits";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { ContextUser } from "../../contexts/ContextUser";
import { useSearchParams } from "react-router-dom";
import { CurrencyType } from "../../types/commom";
import { UserRole } from "../../types/user-role";

const defaultStartDate = utils.retornaDataAtual({ hora: 0, minutos: 0, segundos: 0, millisegundos: 0 });
const defaultEndDate = utils.retornaDataAtual({ hora: 23, minutos: 59, segundos: 59, millisegundos: 999 });

export interface VisitExpenseInfoProps {
    salePersonRoles: UserRole[];
    onDone?: () => void;
    userRoleCanSee?: boolean;
}

export default function VisitExpenseInfo({ salePersonRoles, onDone, userRoleCanSee }: VisitExpenseInfoProps) {
    const { getVisitExpenseInfoPerRole, gettingExpensesInfoPerRole, payVisits } = useVisit();
    const { setConfirmar, setProcessando } = useContext(ContextAlerta);
    const { canEditVisit } = useContext(ContextUser);
    const [searchParams] = useSearchParams();

    const [desibledRootClose, setDesibledRootClose] = useState(false);
    const [startDate, setStartDate] = useState<Date>(defaultStartDate);
    const [endDate, setEndDate] = useState<Date>(defaultEndDate);
    const [salePersonRoleId, setSalePersonRoleId] = useState<string | undefined>(undefined);

    const [expensesInfoPerRole, setExpensesInfoPerRole] = useState<VisitExpenseInfoPerRole[]>([]);

    const divRef = useRef<HTMLDivElement>(null);
    const totalToPay = expensesInfoPerRole.reduce((acc, c) => acc + (c.total - c.pago), 0);

    useEffect(() => {
        const filterValues = VisitUtil.getFilterValuesBy(searchParams);
        setSalePersonRoleId(filterValues.filterSalePersonId);

        if (filterValues.filterVisitDate) {
            setStartDate(new Date(filterValues.filterVisitDate.gte));
            setEndDate(new Date(filterValues.filterVisitDate.lte));
        }
    }, [searchParams]);

    const loadVisitPendingPayments = useCallback(() => {
        getVisitExpenseInfoPerRole({
            where: { gte_dataVisita: startDate, lte_dataVisita: endDate, salePersonId: salePersonRoleId },
        })
            .then(setExpensesInfoPerRole)
            .catch(console.error);
    }, [getVisitExpenseInfoPerRole, startDate, endDate, salePersonRoleId]);

    const checkAsPaid = useCallback(
        async (pendingPayments: VisitExpenseInfoPerRole[]) => {
            setDesibledRootClose(true);
            const confirmou = await setConfirmar(
                "Após esta saída ter sido marcada como paga, não será possível reverter o estado."
            );
            setDesibledRootClose(false);

            if (!confirmou) return;

            const visitsIds = pendingPayments.flatMap((pendingPayment) => pendingPayment.visitasIdsAPagar);
            try {
                setProcessando(true);
                await payVisits(visitsIds);
                setExpensesInfoPerRole([]);
                if (onDone) onDone();
            } catch (err) {
                console.error(err);
            } finally {
                setProcessando(false);
            }
        },
        [onDone, setConfirmar, setProcessando, payVisits]
    );

    return (
        <Dropdown.Root>
            <Dropdown.Item ref={divRef} className="text-primary">
                <span>
                    Gastos totais <strong> a pagar </strong>
                </span>
            </Dropdown.Item>
            <Dropdown.Menu target={divRef.current} placement="bottom-start" rootClose={!desibledRootClose}>
                <Row className="py-2">
                    <Col sm="12" className="border-bottom mb-3 pb-3">
                        <Row>
                            <Col sm="6" className="pe-1 mb-2">
                                <FormGroupInput
                                    type={FormGroupInputType.DATE}
                                    value={startDate}
                                    setValue={setStartDate}
                                    label="Data inicial"
                                />
                            </Col>
                            <Col sm="6" className="ps-1 mb-2">
                                <FormGroupInput
                                    type={FormGroupInputType.DATE}
                                    value={endDate}
                                    setValue={setEndDate}
                                    label="Data final"
                                    useLastTime
                                />
                            </Col>
                            <Col sm="6" className="pe-1">
                                <FormGroupSelect
                                    disabled={userRoleCanSee}
                                    label="Vendedor"
                                    value={salePersonRoleId ?? "Nenhum"}
                                    setValue={(id) => setSalePersonRoleId(id === "" ? undefined : id)}
                                    options={["", ...salePersonRoles.map(({ id }) => id)]}
                                    optionTextFn={(id) =>
                                        salePersonRoles.find(({ id: roleId }) => roleId === id)?.user.name ?? "Todos"
                                    }
                                />
                            </Col>
                            <Col sm="6" className="ps-1 align-self-end">
                                <Button onClick={loadVisitPendingPayments} className="w-100">
                                    Buscar
                                </Button>
                            </Col>
                        </Row>
                    </Col>

                    {gettingExpensesInfoPerRole && (
                        <Col sm="12">
                            <Stack className="d-flex w-100 align-items-center text-primary">
                                <Spinner size="sm" />
                                <span> Aguarde... </span>
                            </Stack>
                        </Col>
                    )}
                    {expensesInfoPerRole.length < 1 && !gettingExpensesInfoPerRole && (
                        <Col sm="12" className="text-center text-secondary-dark">
                            Nenhum gasto a pagar
                        </Col>
                    )}
                    {expensesInfoPerRole.length > 0 && !gettingExpensesInfoPerRole && (
                        <>
                            {expensesInfoPerRole.map((vpp) => (
                                <Col sm="12" key={vpp.salePerson.id}>
                                    <Stack className="bg-secondary bg-opacity-25 mt-2 p-2 rounded">
                                        <h6 className="text-truncate">{vpp.salePerson.user.name}</h6>
                                        <span className="text-secondary-dark">
                                            Pago: {utils.retornaValorMonetario(vpp.pago, CurrencyType.BRL)}
                                        </span>
                                        <div className="d-flex w-100 justify-content-between align-items-center">
                                            <span>
                                                A pagar:{" "}
                                                <strong className="text-primary">
                                                    {utils.retornaValorMonetario(
                                                        vpp.total - vpp.pago,
                                                        CurrencyType.BRL
                                                    )}
                                                </strong>
                                            </span>
                                            {canEditVisit({ visitaPaga: true }) && (
                                                <BotaoAssincrono
                                                    className="rounded-pill"
                                                    variante="outline-primary"
                                                    size="sm"
                                                    onClick={() => checkAsPaid([vpp])}
                                                >
                                                    Pagar
                                                </BotaoAssincrono>
                                            )}
                                        </div>
                                    </Stack>
                                </Col>
                            ))}

                            {canEditVisit({ visitaPaga: true }) && (
                                <div className="d-flex w-100 justify-content-between align-items-center mt-2">
                                    <span>
                                        Total a pagar:{" "}
                                        <strong className="text-primary">
                                            {utils.retornaValorMonetario(totalToPay, CurrencyType.BRL)}
                                        </strong>
                                    </span>
                                    <BotaoAssincrono
                                        className="rounded-pill"
                                        size="sm"
                                        onClick={() => checkAsPaid(expensesInfoPerRole)}
                                    >
                                        Pagar todas
                                    </BotaoAssincrono>
                                </div>
                            )}
                        </>
                    )}
                </Row>
            </Dropdown.Menu>
        </Dropdown.Root>
    );
}
