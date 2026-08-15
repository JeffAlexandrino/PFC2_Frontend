import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import FormGroupSelect from "../formGroups/FormGroupSelect";
import CommissionUtil from "../../utils/commission.util";
import BotaoAssincrono from "../botoes/BotaoAssincrono";
import useCommission from "../../hooks/use-commission";
import SaleUtil from "../../utils/sale.util";
import Dropdown from "../../ui/dropdown";
import utils from "../../utils";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SaleStatus } from "../../types/sale";
import { Col, Row } from "react-bootstrap";
import { User } from "../../types/user";

const defaultStartDate = utils.retornaDataAtual({ hora: 0, minutos: 0, segundos: 0, millisegundos: 0 });
const defaultEndDate = utils.retornaDataAtual({ hora: 23, minutos: 59, segundos: 59, millisegundos: 999 });

export type CommissionReportsProps = { selectedCommissionsIds: string[]; users: User[]; userRoleCanSee: boolean };

export default function CommissionReports({ selectedCommissionsIds, users, userRoleCanSee }: CommissionReportsProps) {
    const [searchParams] = useSearchParams();
    const { getCommissionReports } = useCommission();

    const divRef = useRef<HTMLDivElement>(null);

    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [saleStatus, setSaleStatus] = useState<SaleStatus | undefined>(undefined);
    const [distributorPaid, setDistributorPaid] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);

    useEffect(() => {
        const filterValues = CommissionUtil.getFilterValuesBy(searchParams);
        setUserId(filterValues.userId);
        setSaleStatus(filterValues.saleStatus as SaleStatus);
        setDistributorPaid(filterValues.distributorPaid);

        if (filterValues.commissionDate) {
            setStartDate(new Date(filterValues.commissionDate.gte));
            setEndDate(new Date(filterValues.commissionDate.lte));
        }
    }, [searchParams]);

    const downloadReports = useCallback(async () => {
        let titleReport = "";

        if (selectedCommissionsIds.length > 0)
            titleReport = `Comissões - ${selectedCommissionsIds.length}_selecionados.pdf`;
        else {
            const startDateStr = startDate.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" });
            const endDateStr = endDate.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" });
            titleReport = `Comissões - de ${startDateStr} a ${endDateStr}.pdf`;
        }

        try {
            const relatorio = await getCommissionReports(selectedCommissionsIds, {
                where: {
                    gte_dataComissao: startDate,
                    lte_dataComissao: endDate,
                    estadoVenda: saleStatus,
                    distributorPaid,
                    userId,
                },
            });

            const a = document.createElement("a");

            const blobFile = new Blob([relatorio], { type: "pdf" });
            const url = window.URL.createObjectURL(blobFile);
            a.href = url;
            a.download = titleReport;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        }
    }, [endDate, startDate, saleStatus, userId, getCommissionReports, selectedCommissionsIds, distributorPaid]);

    return (
        <>
            <Dropdown.Root>
                <Dropdown.Item ref={divRef} className="text-primary">
                    <span>Relatórios</span>
                </Dropdown.Item>
                <Dropdown.Menu rootClose target={divRef.current} placement="bottom-start">
                    <Row>
                        {selectedCommissionsIds.length > 0 && (
                            <>
                                <Col sm="12" className="mb-2">
                                    <span className="text-info">
                                        Saídas selecionadas: {selectedCommissionsIds.length}.
                                    </span>
                                </Col>
                                <Col sm="12">
                                    <BotaoAssincrono className="w-100" onClick={downloadReports}>
                                        Baixar relatórios
                                    </BotaoAssincrono>
                                </Col>
                            </>
                        )}
                        {selectedCommissionsIds.length < 1 && (
                            <>
                                <Col sm="6" className="pe-1 mb-2">
                                    <FormGroupInput
                                        label="Data de Comissão: inicial"
                                        type={FormGroupInputType.DATE}
                                        value={startDate}
                                        setValue={setStartDate}
                                    />
                                </Col>
                                <Col sm="6" className="ps-1 mb-2">
                                    <FormGroupInput
                                        label="Data de Comissão: final"
                                        type={FormGroupInputType.DATE}
                                        value={endDate}
                                        setValue={setEndDate}
                                        useLastTime
                                    />
                                </Col>
                                <Col sm="6" className="pe-1">
                                    <FormGroupSelect
                                        label="Estado da venda"
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
                                <Col sm="6" className="pe-1">
                                    <FormGroupSelect
                                        disabled={!userRoleCanSee}
                                        label="Usuário"
                                        value={userId ?? ""}
                                        setValue={(userId) => setUserId(userId === "" ? undefined : userId)}
                                        options={["", ...users.map(({ id }) => id)]}
                                        optionTextFn={(userId) => {
                                            const user = users.find(({ id }) => id === userId);
                                            return user?.name ?? "Todos";
                                        }}
                                    />
                                </Col>
                                <Col sm="6" className="ps-1 align-self-end">
                                    <BotaoAssincrono onClick={downloadReports} className="w-100">
                                        Baixar relatórios
                                    </BotaoAssincrono>
                                </Col>
                            </>
                        )}
                    </Row>
                </Dropdown.Menu>
            </Dropdown.Root>
        </>
    );
}
