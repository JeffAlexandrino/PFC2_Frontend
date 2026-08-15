import FormGroupInput, { FormGroupInputType } from "../../formGroups/FormGroupInput";
import ManageSaleInvoice, { yupSaleInvoiceSchema } from "./manage-sale-invoice";
import FormGroupBoolean from "../../formGroups/FormGroupBoolean";
import FormGroupGeneric from "../../formGroups/FormGroupGeneric";
import FormGroupSelect from "../../formGroups/FormGroupSelect";
import SelectUserRole from "../../selects/select-user-role";
import SelectContrato from "../../selects/SelectContrato";
import SelectCliente from "../../selects/SelectCliente";
import SaleStatusConfirm from "./sale-status-confirm";
import BotaoFechar from "../../botoes/BotaoFechar";
import BotaoLabel from "../../botoes/BotaoLabel";
import SaleUtil from "../../../utils/sale.util";
import useSale from "../../../hooks/use-sale";

import { Button, Form, OverlayTrigger, Stack, Tooltip } from "react-bootstrap";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ButtonAddSale } from "../../botoes/BotaoAdicionarDocumento";
import { Sale, SaleStatus, UpdateSale } from "../../../types/sale";
import { UpdateSaleInvoice } from "../../../types/sale-invoice";
import { ContextAlerta } from "../../../contexts/ContextAlert";
import { ContextUser } from "../../../contexts/ContextUser";
import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { Role } from "../../../types/commom";
import { FormikHelpers } from "formik";
import { v4 } from "uuid";

import * as yup from "yup";

const INFO_DATA_VENDA = "Data considerada pelas métricas de Markup.";

type ManageSaleProps = {
    show?: boolean;
    onDone?: () => void;
    onHide?: () => void;
    saleUpdating?: Sale | null;
    saleCloning?: Sale | null;
};

export default function ManageSale({ saleUpdating, onHide, onDone, saleCloning, ...props }: ManageSaleProps) {
    const { createSale, updateSale, updatingSale, cancelCreateSale, cancelUpdateSale } = useSale();
    const { canAddSale, canUpdateSale, currentUserRole } = useContext(ContextUser);
    const { setConfirmar } = useContext(ContextAlerta);

    const [saleInvoices, setSaleInvoices] = useState<UpdateSaleInvoice[]>([]);

    const [showAddSaleInvoices, setShowAddSaleInvoices] = useState(false);
    const [saleInvoiceIdxUpdating, setSaleInvoiceIdxUpdating] = useState<number | null>(null);

    const saleInvoiceToUpdate = saleInvoiceIdxUpdating !== null ? saleInvoices.at(saleInvoiceIdxUpdating) : null;

    const initialValues: UpdateSale = useMemo(() => {
        if (saleUpdating) return SaleUtil.getOnlyEditData(saleUpdating);
        if (saleCloning) {
            const { id, ...newData } = SaleUtil.getOnlyEditData(saleCloning);
            return { ...newData, estadoVenda: SaleStatus.INITIAL };
        }
        return {
            accountManagerId: null,
            insideSalesId: null,
            referrerId: null,
            comercialManagerId: null,
            comercialAssistantId: null,
            solutionArchitectId: null,
            clienteId: "",
            contratoId: null,
            dataVenda: new Date(),
            estadoVenda: SaleStatus.INITIAL,
            vendaRenovacao: false,
            notasVenda: [],
            numOportunidadeCRM: null,
            numPedidoDistribuidor: null,
        };
    }, [saleUpdating, saleCloning]);

    useEffect(() => setSaleInvoices(initialValues.notasVenda), [initialValues]);

    const disableSaleStatusOptions = useCallback(
        (estadoVenda: SaleStatus) => {
            if (saleUpdating)
                return !canUpdateSale({
                    estadoVenda,
                    accountManagerIdAtual: currentUserRole?.id,
                    estadoVendaAtual: saleUpdating.estadoVenda,
                });

            return !canAddSale({ estadoVenda, accountManagerId: currentUserRole?.id ?? "" });
        },
        [canAddSale, canUpdateSale, currentUserRole, saleUpdating]
    );

    const handleOnRemoveSaleInvoice = useCallback(
        (idxToRemove: number) => setSaleInvoices(saleInvoices.filter((_, idx) => idx !== idxToRemove)),
        [saleInvoices]
    );

    const addOrUpdateSaleInvoice = useCallback(
        (saleInvoiceData: UpdateSaleInvoice) => {
            if (!saleInvoiceToUpdate) {
                setSaleInvoices([...saleInvoices, saleInvoiceData]);
                return setShowAddSaleInvoices(false);
            }

            setSaleInvoices(
                saleInvoices.map((saleInvoice, idx) => (idx === saleInvoiceIdxUpdating ? saleInvoiceData : saleInvoice))
            );
            setSaleInvoiceIdxUpdating(null);
        },
        [saleInvoiceToUpdate, saleInvoices, saleInvoiceIdxUpdating]
    );

    const handleOnSubmit = useCallback(
        async (saleData: UpdateSale, helpers: FormikHelpers<UpdateSale>) => {
            const saleDataWithInvoices = { ...saleData, notasVenda: saleInvoices };

            try {
                if (saleInvoices.length < 1)
                    return helpers.setErrors({ notasVenda: ["É necessário adicionar ao menos uma nota de venda."] });

                if (saleUpdating) {
                    let reasonRegressionStatus: string | undefined;

                    if (saleData.estadoVenda !== saleUpdating.estadoVenda) {
                        const confirmed = await setConfirmar(
                            <SaleStatusConfirm
                                newSaleData={saleDataWithInvoices}
                                oldStatus={saleUpdating.estadoVenda}
                            />
                        );
                        if (!confirmed) return;
                        if (typeof confirmed === "string") reasonRegressionStatus = confirmed;
                    }

                    await updateSale(
                        { id: saleUpdating.id, ...saleDataWithInvoices },
                        {
                            estadoVendaAtual: saleUpdating.estadoVenda,
                            accountManagerIdAtual: saleUpdating.accountManagerId ?? undefined,
                            insideSalesIdAtual: saleUpdating.insideSalesId ?? undefined,
                        },
                        reasonRegressionStatus
                    );
                } else await createSale([saleDataWithInvoices]);

                helpers.setSubmitting(false);
                helpers.resetForm();

                if (onDone) {
                    setSaleInvoices([]);
                    onDone();
                }
            } catch (err) {
                console.error(err);
            }
        },
        [saleInvoices, saleUpdating, updateSale, createSale, onDone, setConfirmar]
    );

    const resetAndHide = useCallback(() => {
        setSaleInvoiceIdxUpdating(null);
        setSaleInvoices([]);
        cancelCreateSale();
        cancelUpdateSale();
        if (onHide) onHide();
    }, [cancelCreateSale, cancelUpdateSale, onHide]);

    return (
        <>
            <OffcanvasForm.Root show={props.show} onHide={resetAndHide}>
                <OffcanvasForm.Header>
                    <OffcanvasForm.Title>{"Editar Venda"}</OffcanvasForm.Title>
                </OffcanvasForm.Header>
                <OffcanvasForm.Body>
                    <OffcanvasForm.Formik
                        validateOnChange={false}
                        validationSchema={yupSaleSchema}
                        initialValues={initialValues}
                        onSubmit={handleOnSubmit}
                    >
                        {({ errors, values, setValues }) => {
                            console.log("Error: ", errors);
                            return (
                                <Stack className="d-flex w-100 gap-3">
                                    <div className="d-flex flex-column w-100 px-3 gap-2">
                                        <h6>Vendedores e cliente</h6>
                                        <FormGroupGeneric
                                            label="Vendedor (AM)"
                                            error={errors.accountManagerId as string}
                                        >
                                            <SelectUserRole
                                                role={Role.VENDEDOR}
                                                selectedId={values.accountManagerId}
                                                setSelectedId={(id) =>
                                                    setValues({ ...values, accountManagerId: id as string })
                                                }
                                            />
                                        </FormGroupGeneric>
                                        {/* <FormGroupGeneric label="Vendedor (IS)" error={errors.insideSalesId as string}>
                                            <SelectUserRole
                                                role={Role.VENDEDOR}
                                                selectedId={values.insideSalesId}
                                                setSelectedId={(id) =>
                                                    setValues({ ...values, insideSalesId: id as string })
                                                }
                                            />
                                        </FormGroupGeneric> */}
                                        <FormGroupGeneric label="Cliente" error={errors.clienteId}>
                                            <SelectCliente
                                                setIdSelecionado={(id) =>
                                                    setValues({ ...values, clienteId: id as string })
                                                }
                                                idSelecionado={values.clienteId}
                                            />
                                        </FormGroupGeneric>
                                    </div>

                                    <div
                                        className="d-flex w-100 flex-column p-3 border-top gap-2"
                                        data-test="outros-papeis"
                                    >
                                        <h6>Outros papéis</h6>

                                        <FormGroupGeneric
                                            label="Gerente comercial"
                                            error={errors.comercialManagerId as string}
                                        >
                                            <SelectUserRole
                                                role={Role.COMERCIAL_MANAGER}
                                                selectedId={values.comercialManagerId}
                                                setSelectedId={(id) => setValues({ ...values, comercialManagerId: id })}
                                            />
                                        </FormGroupGeneric>
                                        <FormGroupGeneric
                                            label="Arquiteto de soluções"
                                            error={errors.solutionArchitectId as string}
                                        >
                                            <SelectUserRole
                                                role={Role.SOLUTION_ARCHITECT}
                                                selectedId={values.solutionArchitectId}
                                                setSelectedId={(id) =>
                                                    setValues({ ...values, solutionArchitectId: id })
                                                }
                                            />
                                        </FormGroupGeneric>
                                        <FormGroupGeneric label="SDR" error={errors.comercialAssistantId as string}>
                                            <SelectUserRole
                                                role={Role.COMERCIAL_ASSISTANT}
                                                selectedId={values.comercialAssistantId}
                                                setSelectedId={(id) =>
                                                    setValues({ ...values, comercialAssistantId: id })
                                                }
                                            />
                                        </FormGroupGeneric>
                                        <FormGroupGeneric
                                            label="Indicador comercial"
                                            error={errors.referrerId as string}
                                        >
                                            <SelectUserRole
                                                role={Role.REFERRER}
                                                selectedId={values.referrerId}
                                                setSelectedId={(id) => setValues({ ...values, referrerId: id })}
                                            />
                                        </FormGroupGeneric>
                                    </div>
                                    <div
                                        className="d-flex flex-column w-100 border-top p-3 gap-2"
                                        data-test="form-group"
                                    >
                                        <Form.Group controlId={v4()}>
                                            <Form.Label as="h6">Notas Fiscais</Form.Label>
                                            <Form.Control isInvalid={!!errors.notasVenda} className="d-none" />
                                            <Form.Control.Feedback type="invalid">
                                                {String(errors.notasVenda?.valueOf())}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <div className="text-dash-orange border border-dash-orange rounded p-2">
                                            Produtos e Serviços devem ser cadastrados em notas diferentes!
                                        </div>
                                        <ListSaleInvoice
                                            saleInvoices={saleInvoices}
                                            onClickAdd={() => setShowAddSaleInvoices(true)}
                                            onClickEdit={setSaleInvoiceIdxUpdating}
                                            onClickDelete={handleOnRemoveSaleInvoice}
                                        />
                                    </div>

                                    <div className="d-flex w-100 flex-column p-3 border-top gap-2">
                                        <h6>Sobre a venda</h6>
                                        <FormGroupGeneric label="Contrato" error={errors.contratoId}>
                                            <SelectContrato
                                                idSelecionado={values.contratoId}
                                                setIdSelecionado={(id) => setValues({ ...values, contratoId: id })}
                                            />
                                        </FormGroupGeneric>
                                        <FormGroupBoolean
                                            label="Venda de renovação?"
                                            value={values.vendaRenovacao}
                                            setValue={(vendaRenovacao) => setValues({ ...values, vendaRenovacao })}
                                            error={errors.vendaRenovacao}
                                        />
                                        <FormGroupSelect
                                            label="Estado da venda"
                                            value={values.estadoVenda}
                                            setValue={(estadoVenda) => setValues({ ...values, estadoVenda })}
                                            options={Object.values(SaleStatus)}
                                            optionTextFn={SaleUtil.getStatusDescriptionBy}
                                            error={errors.estadoVenda}
                                            disableOptionFn={disableSaleStatusOptions}
                                        />
                                        <FormGroupInput
                                            label={
                                                <>
                                                    Data da Venda{" "}
                                                    <OverlayTrigger overlay={<Tooltip>{INFO_DATA_VENDA}</Tooltip>}>
                                                        <i className="bi bi-question-circle-fill text-primary ms-1" />
                                                    </OverlayTrigger>
                                                </>
                                            }
                                            type={FormGroupInputType.DATE}
                                            sm="6"
                                            value={values.dataVenda}
                                            setValue={(dataVenda) => setValues({ ...values, dataVenda })}
                                            error={errors.dataVenda as string}
                                        />
                                        <ButtonAddSale />
                                    </div>

                                    <div className="d-flex flex-column gap-2x border-top px-3">
                                        <h6>Registros Antigos</h6>
                                        {values.numOportunidadeCRM !== null &&
                                            values.numOportunidadeCRM !== undefined && (
                                                <FormGroupInput
                                                    disabled
                                                    label="Núm. Oportunidade CRM"
                                                    type={FormGroupInputType.TEXT}
                                                    value={values.numOportunidadeCRM}
                                                    setValue={(numOportunidadeCRM) =>
                                                        setValues({ ...values, numOportunidadeCRM })
                                                    }
                                                    error={errors.numOportunidadeCRM}
                                                />
                                            )}
                                        {values.numPedidoDistribuidor !== null &&
                                            values.numPedidoDistribuidor !== undefined && (
                                                <FormGroupInput
                                                    disabled
                                                    label="Núm. Pedido Distribuidor"
                                                    type={FormGroupInputType.TEXT}
                                                    value={values.numPedidoDistribuidor}
                                                    setValue={(numPedidoDistribuidor) =>
                                                        setValues({ ...values, numPedidoDistribuidor })
                                                    }
                                                    error={errors.numPedidoDistribuidor}
                                                />
                                            )}
                                    </div>
                                </Stack>
                            );
                        }}
                    </OffcanvasForm.Formik>
                </OffcanvasForm.Body>
                <OffcanvasForm.Footer>
                    <OffcanvasForm.Reset>Cancelar</OffcanvasForm.Reset>
                    <OffcanvasForm.Submit
                        pending={updatingSale}
                        disabled={initialValues.estadoVenda === SaleStatus.PAID}
                    >
                        {"Editar"}
                    </OffcanvasForm.Submit>
                </OffcanvasForm.Footer>
            </OffcanvasForm.Root>

            <ManageSaleInvoice
                show={showAddSaleInvoices || !!saleInvoiceToUpdate}
                onSubmit={addOrUpdateSaleInvoice}
                saleInvoiceUpdating={saleInvoiceToUpdate}
                onHide={() => {
                    setShowAddSaleInvoices(false);
                    setSaleInvoiceIdxUpdating(null);
                }}
            />
        </>
    );
}

function ListSaleInvoice(props: {
    saleInvoices: UpdateSaleInvoice[];
    onClickAdd: () => void;
    onClickEdit: (idx: number) => void;
    onClickDelete: (idx: number) => void;
}) {
    return (
        <Stack className="d-flex w-100 gap-2">
            {props.saleInvoices.map((saleInvoice, idx) => {
                return (
                    <div className="d-flex w-100" key={v4()}>
                        <Stack className="d-flex w-100 position-relative border rounded shadow-sm p-2">
                            <div className="position-absolute end-0 top-0 mt-1 me-1 z-1">
                                <BotaoFechar onClick={() => props.onClickDelete(idx)} />
                            </div>
                            <BotaoLabel
                                variant="info"
                                texto={saleInvoice.codigo ?? "-- Nenhum --"}
                                onClick={() => props.onClickEdit(idx)}
                            />
                            <div className="d-flex w-100 justify-content-between">
                                <small>Parcelas: {saleInvoice.formaParcelamento}</small> |
                                {saleInvoice.vendasProduto.length > 0 ? (
                                    <small>Produtos: {saleInvoice.vendasProduto.length}</small>
                                ) : (
                                    <small>Serviços: {saleInvoice.vendasServico.length}</small>
                                )}
                            </div>
                        </Stack>
                    </div>
                );
            })}
            <div className="w-100 text-end">
                <Button className="rounded-pill" size="sm" onClick={props.onClickAdd}>
                    Adicionar Nota Fiscal
                </Button>
            </div>
        </Stack>
    );
}

//ESQUEMA YUP
export const yupSaleSchema: yup.ObjectSchema<UpdateSale> = yup.object({
    accountManagerId: yup.string().defined("Selecione o vendedor AM.").nullable(),
    insideSalesId: yup.string().defined("Selecione o vendedor IS.").nullable(),
    referrerId: yup.string().defined("Selecione o indicador.").nullable(),
    comercialManagerId: yup
        .string()
        .defined("Selecione um gerente comercial.")
        .nullable()
        .when("accountManagerId", ([accountManagerId], schema) =>
            accountManagerId ? schema : schema.nonNullable("Selecione um gerente comercial.")
        ),
    solutionArchitectId: yup.string().defined("Selecione um gerente comercial.").nullable(),
    comercialAssistantId: yup.string().defined("Selecione um SDR.").nullable(),
    estadoVenda: yup.mixed<SaleStatus>().oneOf(Object.values(SaleStatus)).required("Este campo é necessário."),
    clienteId: yup.string().required("Selecione um cliente."),
    contratoId: yup.string().defined("Definir ContradoId nas vendas").nullable(),
    dataVenda: yup.date().required("Este campo é orbigatório."),
    vendaRenovacao: yup.boolean().required("Este campo é necessário."),
    notasVenda: yup.array(yupSaleInvoiceSchema).required("Este campo é necessário."),
    //Campos Antigos
    numOportunidadeCRM: yup.string().optional().nullable(),
    numPedidoDistribuidor: yup.string().optional().nullable(),
});
