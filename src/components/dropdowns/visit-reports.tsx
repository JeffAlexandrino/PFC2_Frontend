import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import FormGroupSelect from "../formGroups/FormGroupSelect";
import BotaoAssincrono from "../botoes/BotaoAssincrono";
import VisitUtil from "../../utils/visit.util";
import useVisit from "../../hooks/use-visit";
import Dropdown from "../../ui/dropdown";
import utils from "../../utils";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UserRole } from "../../types/user-role";
import { Col, Row } from "react-bootstrap";

const defaultStartDate = utils.retornaDataAtual({ hora: 0, minutos: 0, segundos: 0, millisegundos: 0 });
const defaultEndDate = utils.retornaDataAtual({ hora: 23, minutos: 59, segundos: 59, millisegundos: 999 });

export type VisitReportsProps = { selectedVisitsIds: string[]; salePersonRoles: UserRole[]; userRoleCanSee?: boolean };

export default function VisitReports({ selectedVisitsIds, salePersonRoles, userRoleCanSee }: VisitReportsProps) {
    const [searchParams] = useSearchParams();
    const { getVisitReports } = useVisit();

    const divRef = useRef<HTMLDivElement>(null);

    const [salePersonRoleId, setSalePersonRoleId] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);

    useEffect(() => {
        const filterValues = VisitUtil.getFilterValuesBy(searchParams);
        setSalePersonRoleId(filterValues.filterSalePersonId);

        if (filterValues.filterVisitDate) {
            setStartDate(new Date(filterValues.filterVisitDate.gte));
            setEndDate(new Date(filterValues.filterVisitDate.lte));
        }
    }, [searchParams]);

    const findReports = useCallback(async () => {
        let titleReport = "";
        if (selectedVisitsIds.length > 0) titleReport = `Saídas - ${selectedVisitsIds.length}_selecionados.pdf`;
        else {
            const startDateStr = startDate.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" });
            const endDateStr = endDate.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" });
            titleReport = `Saídas - de ${startDateStr} a ${endDateStr}.pdf`;
        }

        try {
            const relatorio = await getVisitReports(selectedVisitsIds, {
                where: {
                    gte_dataVisita: startDate,
                    lte_dataVisita: endDate,
                    salePersonId: salePersonRoleId,
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
    }, [selectedVisitsIds, salePersonRoleId, startDate, endDate, getVisitReports]);

    return (
        <>
            <Dropdown.Root>
                <Dropdown.Item ref={divRef} className="text-primary">
                    <span>Relatórios</span>
                </Dropdown.Item>
                <Dropdown.Menu rootClose target={divRef.current} placement="bottom-start">
                    <Row className="py-2">
                        {selectedVisitsIds.length > 0 && (
                            <>
                                <Col sm="12" className="mb-2">
                                    <span className="text-info">Saídas selecionadas: {selectedVisitsIds.length}.</span>
                                </Col>
                                <Col sm="12">
                                    <BotaoAssincrono className="w-100" onClick={findReports}>
                                        Baixar relatórios
                                    </BotaoAssincrono>
                                </Col>
                            </>
                        )}
                        {selectedVisitsIds.length < 1 && (
                            <>
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
                                            salePersonRoles.find(({ id: roleId }) => roleId === id)?.user.name ??
                                            "Todos"
                                        }
                                    />
                                </Col>
                                <Col sm="6" className="ps-1 align-self-end">
                                    <BotaoAssincrono className="w-100" onClick={findReports}>
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
