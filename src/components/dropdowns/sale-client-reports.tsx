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

export type SaleClientReportsProps = { selectedSalesIds: string[]; sales: Sale[] };

export default function SaleClientReports({ selectedSalesIds, sales }: SaleClientReportsProps) {
    const { getSalesClientReports } = useSale();

    const [searchParams] = useSearchParams();
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [clienteId, setClienteId] = useState<string | undefined>(undefined);
    const [saleStatus, setSaleStatus] = useState<SaleStatus | undefined>(undefined);
    const [numPedidoDistribuidor, setNumPedidoDistribuidor] = useState<string | undefined>(undefined);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const filterValues = SaleUtil.getFilterValuesBy(searchParams);
        setClienteId(filterValues.filterCustomerId);
        setSaleStatus(filterValues.filterSaleStatus as SaleStatus);
        setNumPedidoDistribuidor(filterValues.filterNumDistributor);

        if (filterValues.filterSaleDate) {
            setStartDate(new Date(filterValues.filterSaleDate.gte));
            setEndDate(new Date(filterValues.filterSaleDate.lte));
        }
    }, [searchParams]);

    const downloadReports = useCallback(async () => {
        let titleReport = "";

        if (selectedSalesIds.length > 0) titleReport = `Vendas_Clientes - ${selectedSalesIds.length}_selecionados.pdf`;
        else {
            const startDateStr = startDate.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" });
            const endDateStr = endDate.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" });
            titleReport = `Vendas_Clientes - de ${startDateStr} a ${endDateStr}.pdf`;
        }
        try {
            const relatorio = await getSalesClientReports(selectedSalesIds, {
                where: {
                    gte_dataVenda: startDate.toISOString(),
                    lte_dataVenda: endDate.toISOString(),
                    estadoVenda: saleStatus,
                    numPedidoDistribuidor: numPedidoDistribuidor,
                    clienteId: clienteId,
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
    }, [endDate, startDate, saleStatus, clienteId, getSalesClientReports, selectedSalesIds, numPedidoDistribuidor]);

    return (
        <>
            <Dropdown.Root>
                <Dropdown.Item ref={divRef} className="text-primary">
                    <span>Relatório por Cliente</span>
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
                                        Baixar relatórios por Cliente
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
                                        label="Cliente"
                                        value={clienteId ?? ""}
                                        setValue={(userId) => setClienteId(userId === "" ? undefined : userId)}
                                        options={[
                                            "",
                                            ...sales
                                                .map((sales) => sales.clienteId)
                                                .filter((salesId, idx, arr) => arr.indexOf(salesId) === idx),
                                        ]}
                                        optionTextFn={(userId) => {
                                            if (userId === "") return "Todos";
                                            const cliente = sales.find(({ clienteId }) => clienteId === userId);
                                            return cliente?.cliente.name ?? "";
                                        }}
                                    />
                                </Col>
                                <Col sm="6" className="ps-1 align-self-end">
                                    <BotaoAssincrono onClick={downloadReports} className="w-100">
                                        Baixar relatório por Cliente
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
