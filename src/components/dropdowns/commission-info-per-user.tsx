import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import FormGroupSelect from "../formGroups/FormGroupSelect";
import CommissionUtil from "../../utils/commission.util";
import BotaoAssincrono from "../botoes/BotaoAssincrono";
import useCommission from "../../hooks/use-commission";
import SaleUtil from "../../utils/sale.util";
import Dropdown from "../../ui/dropdown";
import utils from "../../utils";

import { Button, Col, OverlayTrigger, Row, Spinner, Stack, Tooltip } from "react-bootstrap";
import { CommissionInfoPerUser as TCommissionInfoPerUser } from "../../types/commission";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { ContextUser } from "../../contexts/ContextUser";
import { useSearchParams } from "react-router-dom";
import { CurrencyType } from "../../types/commom";
import { SaleStatus } from "../../types/sale";

const EXPECTED_VALUE_EXPLANATION = "Este valor é o esperado caso a meta seja alcançada.";

export interface CommissionInfoPerUserProps {
    className?: string;
    onDone?: () => void;
}

const defaultStartDate = utils.retornaDataAtual({ hora: 0, minutos: 0, segundos: 0, millisegundos: 0 });
const defaultEndDate = utils.retornaDataAtual({ hora: 23, minutos: 59, segundos: 59, millisegundos: 999 });

export default function CommissionInfoPerUser({ onDone, ...props }: CommissionInfoPerUserProps) {
    const { canEditCommission, canReadCommission, currentUserRole } = useContext(ContextUser);
    const { setConfirmar, setProcessando } = useContext(ContextAlerta);
    const [searchParams] = useSearchParams();

    const {
        getCommissionInfoPerRole,
        gettingCommissionInfoPerRole,
        updateCommissionsPaymentStatus,
        approveManyCommissions,
        getCommissionReports,
    } = useCommission();

    const [desibledRootClose, setDesibledRootClose] = useState(false);
    const [distributorPaid, setDistributorPaid] = useState<string | undefined>(undefined);
    const [saleStatus, setSaleStatus] = useState<SaleStatus | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date>(defaultStartDate);
    const [endDate, setEndDate] = useState<Date>(defaultEndDate);

    const [commissionInfoPerRole, setCommissionInfoPerRole] = useState<TCommissionInfoPerUser[]>([]);

    const divRef = useRef<HTMLDivElement>(null);
    const totalExpected = commissionInfoPerRole.reduce((acc, c) => acc + c.expectedValue, 0);
    const totalApproved = commissionInfoPerRole.reduce((acc, c) => acc + c.approvedValue, 0);

    useEffect(() => {
        const filterValues = CommissionUtil.getFilterValuesBy(searchParams);
        setSaleStatus(filterValues.saleStatus as SaleStatus);
        setDistributorPaid(filterValues.distributorPaid);

        if (filterValues.commissionDate) {
            setStartDate(new Date(filterValues.commissionDate.gte));
            setEndDate(new Date(filterValues.commissionDate.lte));
        }
    }, [searchParams]);

    const loadCommissionPendingPayments = useCallback(() => {
        const where = {
            gte_dataComissao: startDate,
            lte_dataComissao: endDate,
            estadoVenda: saleStatus,
            distributorPaid,
        };
        if (canReadCommission({}))
            return getCommissionInfoPerRole({ where }).then(setCommissionInfoPerRole).catch(console.error);

        getCommissionInfoPerRole({
            where: { ...where, userId: currentUserRole?.userId },
        })
            .then(setCommissionInfoPerRole)
            .catch(console.error);
    }, [
        getCommissionInfoPerRole,
        startDate,
        endDate,
        saleStatus,
        canReadCommission,
        currentUserRole,
        distributorPaid,
    ]);

    // Baixa um relatório ao "Pagar todas"
    const downloadReports = useCallback(
        async (commissionsIds: string[]) => {
            try {
                const relatorio = await getCommissionReports(commissionsIds, {
                    where: {
                        gte_dataComissao: startDate,
                        lte_dataComissao: endDate,
                        estadoVenda: saleStatus,
                        distributorPaid,
                    },
                });

                const startDateStr = startDate.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" });
                const endDateStr = endDate.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" });

                const titleReport = `Comissões - de ${startDateStr} a ${endDateStr}.pdf`;

                const blobFile = new Blob([relatorio], { type: "pdf" });
                const url = window.URL.createObjectURL(blobFile);

                const a = document.createElement("a");
                a.href = url;
                a.download = titleReport;
                a.click();

                window.URL.revokeObjectURL(url);
            } catch (err) {
                console.error(err);
            }
        },
        [startDate, endDate, saleStatus, distributorPaid, getCommissionReports]
    );

    const checkAsPaid = useCallback(
        async (commissionPendingPayments: TCommissionInfoPerUser[]) => {
            setDesibledRootClose(true);
            try {
                const confirmou = await setConfirmar(
                    "Após estas comissões serem marcadas como pagas, não será possível reverter o estado."
                );
                if (!confirmou) return;

                const commissionsIds = commissionPendingPayments.flatMap((vc) => vc.comissoesIdsAPagar);

                setProcessando(true);
                await updateCommissionsPaymentStatus(commissionsIds);

                await downloadReports(commissionsIds);

                loadCommissionPendingPayments();
                if (onDone) onDone();
            } catch (err) {
                console.error(err);
            } finally {
                setProcessando(false);
                setDesibledRootClose(false);
            }
        },
        [
            updateCommissionsPaymentStatus,
            downloadReports,
            onDone,
            setConfirmar,
            setProcessando,
            loadCommissionPendingPayments,
        ]
    );

    const approveMany = useCallback(
        async (commissionPendingPayments: TCommissionInfoPerUser[]) => {
            const commissionsIds = commissionPendingPayments.flatMap((vc) => vc.comissoesIdsAPagar);
            setProcessando(true);
            approveManyCommissions(commissionsIds)
                .then(loadCommissionPendingPayments)
                .catch(console.error)
                .finally(() => setProcessando(false));
        },
        [setProcessando, approveManyCommissions, loadCommissionPendingPayments]
    );

    return (
        <>
            <Dropdown.Root className={props.className}>
                <Dropdown.Item ref={divRef} className="text-primary">
                    <span>
                        Comissões totais <strong> a pagar </strong>
                    </span>
                </Dropdown.Item>
                <Dropdown.Menu rootClose={!desibledRootClose} target={divRef.current} placement="bottom-start">
                    <Row className="py-1">
                        <Col sm="12" className="border-bottom mb-1 pb-2">
                            <Row>
                                <Col sm="6" className="pe-1 mb-2">
                                    <FormGroupInput
                                        type={FormGroupInputType.DATE}
                                        value={startDate}
                                        setValue={setStartDate}
                                        label="Data de Comissão: inicial"
                                    />
                                </Col>
                                <Col sm="6" className="ps-1 mb-2">
                                    <FormGroupInput
                                        type={FormGroupInputType.DATE}
                                        value={endDate}
                                        setValue={setEndDate}
                                        label="Data de Comissão: final"
                                        useLastTime
                                    />
                                </Col>
                                <Col sm="6" className="pe-1 mb-2">
                                    <FormGroupSelect
                                        label="Estado da Venda"
                                        value={saleStatus ?? ""}
                                        setValue={(newSaleStatus) =>
                                            setSaleStatus(
                                                newSaleStatus === "" ? undefined : (newSaleStatus as SaleStatus)
                                            )
                                        }
                                        options={["", ...Object.values(SaleStatus)]}
                                        optionTextFn={(saleStatus) =>
                                            saleStatus === ""
                                                ? "Todos"
                                                : SaleUtil.getStatusDescriptionBy(saleStatus as SaleStatus)
                                        }
                                    />
                                </Col>
                                <Col sm="6" className="ps-1 mb-2">
                                    <FormGroupSelect
                                        label="Paga pelo fornecedor"
                                        value={distributorPaid ?? ""}
                                        setValue={(distributorPaid) =>
                                            setDistributorPaid(distributorPaid === "" ? undefined : distributorPaid)
                                        }
                                        options={["", "true", "false"]}
                                        optionTextFn={(distributorPaid) =>
                                            distributorPaid === ""
                                                ? "Todas"
                                                : distributorPaid === "true"
                                                  ? "Sim"
                                                  : "Não"
                                        }
                                    />
                                </Col>
                                <Col sm="12" className="align-self-end">
                                    <Button onClick={loadCommissionPendingPayments} className="w-100">
                                        Buscar
                                    </Button>

                                    <div className="text-info border border-info rounded py-2 px-2 mt-1">
                                        <ul className="mb-0 border-bottom pb-2">
                                            <li>
                                                <strong> Comissões aprovadas quando:</strong> <br />
                                                1. Venda com o status "Disponível para Pagamento" <br />
                                                2. Marcada como paga pelo Distribuidor. <br />
                                            </li>
                                        </ul>
                                        
                                        Quando todas as comissões estiverem aprovadas e pagas, o status da venda será
                                        atualizado automaticamente para "Pago".
                                    </div>
                                </Col>
                            </Row>
                        </Col>

                        {gettingCommissionInfoPerRole && (
                            <Col sm="12">
                                <Stack className="d-flex w-100 align-items-center text-primary">
                                    <Spinner size="sm" />
                                    <span> Aguarde... </span>
                                </Stack>
                            </Col>
                        )}
                        {commissionInfoPerRole.length < 1 && !gettingCommissionInfoPerRole && (
                            <Col sm="12" className="text-center text-secondary-dark">
                                Nenhuma comissão a pagar
                            </Col>
                        )}
                        {commissionInfoPerRole.length > 0 && !gettingCommissionInfoPerRole && (
                            <>
                                {commissionInfoPerRole.map((vc) => (
                                    <Col sm="12" key={vc.user.id}>
                                        <Stack className="bg-secondary bg-opacity-25 mt-2 p-2 rounded">
                                            <h6 className="text-truncate">{vc.user.name}</h6>
                                            <span>
                                                Esperado:{" "}
                                                <strong className="text-info">
                                                    {utils.retornaValorMonetario(vc.expectedValue, CurrencyType.BRL)}
                                                </strong>{" "}
                                                <OverlayTrigger
                                                    overlay={<Tooltip>{EXPECTED_VALUE_EXPLANATION}</Tooltip>}
                                                >
                                                    <i className="bi bi-question-circle-fill text-info" />
                                                </OverlayTrigger>
                                            </span>
                                            <span>
                                                Aprovado:{" "}
                                                <strong className="text-primary">
                                                    {utils.retornaValorMonetario(vc.approvedValue, CurrencyType.BRL)}
                                                </strong>
                                            </span>
                                            <span className="text-secondary-dark">
                                                Pago: {utils.retornaValorMonetario(vc.pago, CurrencyType.BRL)}
                                            </span>
                                            <div className="d-flex justify-content-end gap-2 pt-1">
                                                {canEditCommission({}) && (
                                                    <BotaoAssincrono
                                                        variante="info"
                                                        size="sm"
                                                        onClick={() => approveMany([vc])}
                                                    >
                                                        Aprovar
                                                    </BotaoAssincrono>
                                                )}
                                                {canEditCommission({}) && (
                                                    <BotaoAssincrono
                                                        variante="primary"
                                                        size="sm"
                                                        onClick={() => checkAsPaid([vc])}
                                                    >
                                                        Pagar
                                                    </BotaoAssincrono>
                                                )}
                                            </div>
                                        </Stack>
                                    </Col>
                                ))}

                                {canEditCommission({}) && (
                                    <Stack className="mt-2">
                                        <span>
                                            Esperado:{" "}
                                            <strong className="text-info">
                                                {utils.retornaValorMonetario(totalExpected, CurrencyType.BRL)}
                                            </strong>{" "}
                                            <OverlayTrigger overlay={<Tooltip>{EXPECTED_VALUE_EXPLANATION}</Tooltip>}>
                                                <i className="bi bi-question-circle-fill text-info" />
                                            </OverlayTrigger>
                                        </span>
                                        <span>
                                            Aprovado:{" "}
                                            <strong className="text-primary">
                                                {utils.retornaValorMonetario(totalApproved, CurrencyType.BRL)}
                                            </strong>
                                        </span>
                                        <div className="d-flex w-100 justify-content-end gap-2 pt-1">
                                            <BotaoAssincrono
                                                variante="info"
                                                size="sm"
                                                onClick={() => approveMany(commissionInfoPerRole)}
                                            >
                                                Aprovar todas
                                            </BotaoAssincrono>
                                            <BotaoAssincrono
                                                size="sm"
                                                onClick={() => checkAsPaid(commissionInfoPerRole)}
                                            >
                                                Pagar todas
                                            </BotaoAssincrono>
                                        </div>
                                    </Stack>
                                )}
                            </>
                        )}
                    </Row>
                </Dropdown.Menu>
            </Dropdown.Root>
        </>
    );
}
