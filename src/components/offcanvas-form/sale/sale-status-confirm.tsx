import FormGroupInput, { FormGroupInputType } from "../../formGroups/FormGroupInput";
import React, { useContext } from "react";

import { ContextAlerta } from "../../../contexts/ContextAlert";
import { NewSale, SaleStatus } from "../../../types/sale";

export default function SaleStatusConfirm(props: { newSaleData: NewSale; oldStatus: SaleStatus }) {
    const { confirmReason, setConfirmReason } = useContext(ContextAlerta);

    const indexNewStatus = Object.values(SaleStatus).indexOf(props.newSaleData.estadoVenda);
    const indexOldStatus = Object.values(SaleStatus).indexOf(props.oldStatus);

    const hasRegressed = indexNewStatus < indexOldStatus;

    if (hasRegressed)
        return (
            <div className="d-flex flex-column" id="Motivo-Retrocesso">
                <p>
                    Você está tentando retroceder o estado da venda. Informe ao responsável pelo novo estado o motivo
                    desse retrocesso.
                </p>
                <FormGroupInput
                    type={FormGroupInputType.TEXT_AREA}
                    label="Motivo do retrocesso"
                    value={confirmReason}
                    placeholder="Descreva brevemente o motivo do retrocesso."
                    setValue={setConfirmReason}
                    max={100}
                />
            </div>
        );

    switch (props.newSaleData.estadoVenda) {
        case SaleStatus.BILLING_AUDIT:
            const salesInvoiceWithoutCode = props.newSaleData.notasVenda.filter(
                (saleInvoice) => saleInvoice.codigo === null
            );
            return (
                <div className="d-flex flex-column gap-3">
                    {salesInvoiceWithoutCode.length > 0 ? (
                        <SpanAlert type="danger">
                            Existem notas fiscais sem código.{" "}
                            <strong>Notas sem código: {salesInvoiceWithoutCode.length}</strong>
                        </SpanAlert>
                    ) : (
                        <SpanAlert type="success">Todas as notas fiscais possuem código.</SpanAlert>
                    )}

                    <p>
                        Após esta ação somente <strong>Administradores</strong>, <strong>Gerentes Comerciais</strong> e{" "}
                        <strong>Analistas de Comissão</strong> poderão realizar modificações na venda.
                    </p>
                </div>
            );
        case SaleStatus.FINANCIAL_AUDIT:
            return (
                <p>
                    Após esta ação, somente <strong>Administradores</strong> e <strong>Gerentes Comerciais</strong>
                    poderão realizar modificações na venda.
                </p>
            );
        case SaleStatus.AVAILABLE_PAYMENT:
            return (
                <div className="d-flex flex-column gap-3">
                    <SpanAlert type="success">Comissões aprovadas e pagamento confirmado.</SpanAlert>
                    <p>
                        Após esta ação, apenas <strong>Administradores</strong> e
                        <strong>Analistas de Comissões </strong>
                        poderão continuar modificando a venda.
                    </p>
                </div>
            );
        case SaleStatus.PAID:
            const saleWithoutManager = props.newSaleData.comercialManagerId === null;
            const saleWithoutReferrer = props.newSaleData.referrerId === null;
            const saleWithoutArchitect = props.newSaleData.solutionArchitectId === null;
            const saleWithoutAssistant = props.newSaleData.comercialAssistantId === null;

            return (
                <div className="d-flex flex-column gap-3">
                    {saleWithoutManager && (
                        <SpanAlert type="danger">
                            A venda não possui um <strong>Gerente Comercial</strong>.
                        </SpanAlert>
                    )}
                    {saleWithoutReferrer && (
                        <SpanAlert type="warning">
                            A venda não possui um <strong>Indicador Comercial</strong>.
                        </SpanAlert>
                    )}
                    {saleWithoutArchitect && (
                        <SpanAlert type="warning">
                            A venda não possui um <strong>Arquiteto de Solução</strong>.
                        </SpanAlert>
                    )}
                    {saleWithoutAssistant && (
                        <SpanAlert type="warning">
                            A venda não possui um <strong>SDR</strong>.
                        </SpanAlert>
                    )}
                    {!saleWithoutManager && !saleWithoutReferrer && !saleWithoutArchitect && !saleWithoutAssistant && (
                        <SpanAlert type="success">Todos os papéis foram selecionados.</SpanAlert>
                    )}

                    <p>
                        Após esta ação <strong>não</strong> será possível realizar modificações na venda.
                    </p>
                </div>
            );
        default:
            return <></>;
    }
}

function SpanAlert(props: { children?: React.ReactNode; type: "success" | "danger" | "warning" }) {
    if (props.type === "success")
        return (
            <span className="text-success bg-success bg-opacity-25 rounded p-2 border border-success">
                <i className="bi bi-check-circle-fill" aria-label="Sucesso" /> {props.children}
            </span>
        );

    if (props.type === "warning")
        return (
            <span className="text-warning bg-warning bg-opacity-25 rounded p-2 border border-warning">
                <i className="bi bi-exclamation-triangle-fill" aria-label="Atenção" /> {props.children}
            </span>
        );

    return (
        <span className="text-danger bg-danger bg-opacity-25 rounded p-2 border border-danger">
            <i className="bi bi-exclamation-triangle-fill" aria-label="Atenção" /> {props.children}
        </span>
    );
}
