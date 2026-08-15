import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import FormGroupSelect from "../formGroups/FormGroupSelect";
import BotaoAssincrono from "../botoes/BotaoAssincrono";
import SaleUtil from "../../utils/sale.util";
import useSale from "../../hooks/use-sale";
import Dropdown from "../../ui/dropdown";
import utils from "../../utils";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sale, SaleStatus } from "../../types/sale";
import { useSearchParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

const defaultStartDate = utils.retornaDataAtual({ hora: 0, minutos: 0, segundos: 0, millisegundos: 0 });
const defaultEndDate = utils.retornaDataAtual({ hora: 23, minutos: 59, segundos: 59, millisegundos: 999 });

export type SaleUserReportsProps = { selectedSalesIds: string[]; sales: Sale[] };

export default function SaleUsersReports({ selectedSalesIds, sales }: SaleUserReportsProps) {
    const { getSalesUserReports } = useSale();

    const [searchParams] = useSearchParams();
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [saleStatus, setSaleStatus] = useState<SaleStatus | undefined>(undefined);
    const [numPedidoDistribuidor, setNumPedidoDistribuidor] = useState<string | undefined>(undefined);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const filterValues = SaleUtil.getFilterValuesBy(searchParams);
        setUserId(filterValues.filterSalePersonId);
        setSaleStatus(filterValues.filterSaleStatus as SaleStatus);
        setNumPedidoDistribuidor(filterValues.filterNumDistributor);

        if (filterValues.filterSaleDate) {
            setStartDate(new Date(filterValues.filterSaleDate.gte));
            setEndDate(new Date(filterValues.filterSaleDate.lte));
        }
    }, [searchParams]);

    const downloadReports = useCallback(async () => {
        let titleReport = "";

        if (selectedSalesIds.length > 0)
            titleReport = `Vendas_AM-Gerente - ${selectedSalesIds.length}_selecionados.pdf`;
        else {
            const startDateStr = startDate.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" });
            const endDateStr = endDate.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" });
            titleReport = `Vendas_AM-Gerente - de ${startDateStr} a ${endDateStr}.pdf`;
        }
        try {
            const relatorio = await getSalesUserReports(selectedSalesIds, {
                where: {
                    gte_dataVenda: startDate.toISOString(),
                    lte_dataVenda: endDate.toISOString(),
                    estadoVenda: saleStatus,
                    numPedidoDistribuidor: numPedidoDistribuidor,
                    comercialManagerId: userId,
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
    }, [endDate, startDate, saleStatus, getSalesUserReports, selectedSalesIds, numPedidoDistribuidor, userId]);

    return (
        <>
            <Dropdown.Root>
                <Dropdown.Item ref={divRef} className="text-primary">
                    <span>Relatório por Responsável</span>
                </Dropdown.Item>
                <Dropdown.Menu rootClose target={divRef.current} placement="bottom-start">
                    <Row>
                        {selectedSalesIds.length > 0 && (
                            <>
                                <Col sm="12" className="mb-2">
                                    <span className="text-info">Vendas selecionadas: {selectedSalesIds.length}.</span>
                                </Col>
                                <Col sm="12">
                                    <BotaoAssincrono className="w-100" onClick={downloadReports}>
                                        Baixar relatórios por Responsável
                                    </BotaoAssincrono>
                                </Col>
                            </>
                        )}
                        {selectedSalesIds.length < 1 && (
                            <>
                                <Col sm="6" className="pe-1 mb-2">
                                    <FormGroupInput
                                        label="Data Venda: inicial"
                                        type={FormGroupInputType.DATE}
                                        value={startDate}
                                        setValue={setStartDate}
                                    />
                                </Col>
                                <Col sm="6" className="ps-1 mb-2">
                                    <FormGroupInput
                                        label="Data Venda: final"
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
                                        value={numPedidoDistribuidor ?? ""}
                                        setValue={(distributorPaid) =>
                                            setNumPedidoDistribuidor(
                                                distributorPaid === "" ? undefined : distributorPaid
                                            )
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
                                        label="Vendedor"
                                        value={userId ?? ""}
                                        setValue={(userId) => setUserId(userId === "" ? undefined : userId)}
                                        options={[
                                            "",
                                            ...sales
                                                .map((sales) => sales.comercialManagerId!)
                                                .filter((salesId, idx, arr) => arr.indexOf(salesId) === idx),
                                        ]}
                                        optionTextFn={(userId) => {
                                            if (userId === "") return "Todos";
                                            const vendedor = sales.find(
                                                ({ comercialManagerId }) => comercialManagerId === userId
                                            );
                                            return vendedor?.comercialManager?.user.name ?? "";
                                        }}
                                    />
                                </Col>
                                <Col sm="6" className="ps-1 align-self-end">
                                    <BotaoAssincrono onClick={downloadReports} className="w-100">
                                        Baixar relatório por Responsável
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
