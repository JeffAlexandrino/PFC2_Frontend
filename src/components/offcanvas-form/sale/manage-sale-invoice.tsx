import FormGroupInput, { FormGroupInputType } from "../../formGroups/FormGroupInput";
import ManageSaleService, { yupSaleServiceSchema } from "./manage-sale-service";
import ManageSaleProduct, { yupSaleProductSchema } from "./manage-sale-product";
import SelectFormaPagamento from "../../selects/SelectFormaPagamento";
import FormGroupGeneric from "../../formGroups/FormGroupGeneric";
import FormGroupSelect from "../../formGroups/FormGroupSelect";
import useService from "../../../hooks/use-service";
import StringUtil from "../../../utils/string.util";
import useProduct from "../../../hooks/use-product";
import BotaoFechar from "../../botoes/BotaoFechar";
import BotaoLabel from "../../botoes/BotaoLabel";
import utils from "../../../utils";

import { ButtonAddInvoice, ButtonAddTicket } from "../../botoes/BotaoAdicionarDocumento";
import { Button, Form, OverlayTrigger, Row, Stack, Tooltip } from "react-bootstrap";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UpdateSaleInvoice } from "../../../types/sale-invoice";
import { UpdateProductSale } from "../../../types/sale-product";
import { UpdateServiceSale } from "../../../types/sale-service";
import { ContextAlerta } from "../../../contexts/ContextAlert";
import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { CurrencyType } from "../../../types/commom";
import { RevenueType } from "../../../types/sale";
import { Service } from "../../../types/service";
import { Product } from "../../../types/product";
import { FormikHelpers } from "formik";
import { v4 } from "uuid";

import * as yup from "yup";

export const INFO_MARKUP_LIQUIDO =
    "Valor de comissão listado no site do distribuidor referente à comissão a ser paga para a revenda.";

type ManageSaleInvoiceProps = {
    onHide?: () => void;
    onSubmit: (values: UpdateSaleInvoice) => void;
    saleInvoiceUpdating?: UpdateSaleInvoice | null;
    show?: boolean;
};

export default function ManageSaleInvoice({ onHide, saleInvoiceUpdating, onSubmit, ...props }: ManageSaleInvoiceProps) {
    const { setPerigo, setAviso } = useContext(ContextAlerta);

    const [valorCustoTotalProduto, setValorCustoTotalProduto] = useState(0);
    const [valorCustoTotalServico, setValorCustoTotalServico] = useState(0);

    const { findManyServices, cancelFindManyServices } = useService();
    const [services, setServicos] = useState<Service[]>([]);

    const { findManyProducts, cancelFindManyProducts } = useProduct();
    const [products, setProdutos] = useState<Product[]>([]);

    const [invoiceProductServices, setInvoiceProductsServices] = useState<
        Pick<UpdateSaleInvoice, "vendasProduto" | "vendasServico">
    >({ vendasProduto: [], vendasServico: [] });

    const [addedProduct, setAddedProduct] = useState(false);
    const [showAddSaleProduct, setShowAddSaleProduct] = useState(false);
    const [saleProductUpdating, setSaleProductUpdating] = useState<UpdateProductSale | null>(null);

    const [addedService, setAddedService] = useState(false);
    const [showAddSaleService, setShowAddSaleService] = useState(false);
    const [saleServiceUpdating, setSaleServiceUpdating] = useState<UpdateServiceSale | null>(null);

    const hasService = saleInvoiceUpdating?.vendasServico && saleInvoiceUpdating.vendasServico.length > 0;
    const hasProduct = saleInvoiceUpdating?.vendasProduto && saleInvoiceUpdating.vendasProduto.length > 0;
    const isNewSale = !hasProduct && !hasService;

    const initialValues: UpdateSaleInvoice = useMemo(
        () =>
            saleInvoiceUpdating ?? {
                codigo: null,
                dataFaturamento: new Date(),
                formaPagamentoId: "",
                formaParcelamento: 1,
                datasBoleto: [new Date()],
                numOportunidadeCRM: null,
                numPedidoDistribuidor: null,
                impostoNota: 0,
                dedutiveisDistribuidor: 0,
                tipoFaturamento: RevenueType.DIRETO,
                markup: 0,
                vendasProduto: [],
                vendasServico: [],
            },
        [saleInvoiceUpdating]
    );

    useEffect(
        () =>
            setInvoiceProductsServices({
                vendasProduto: initialValues.vendasProduto,
                vendasServico: initialValues.vendasServico,
            }),
        [initialValues]
    );

    useEffect(() => {
        findManyProducts().then(setProdutos).catch(console.error);
        findManyServices().then(setServicos).catch(console.error);
        return () => {
            cancelFindManyProducts();
            cancelFindManyServices();
        };
    }, [cancelFindManyProducts, findManyProducts, cancelFindManyServices, findManyServices, setAviso]);

    const removeSaleProduct = useCallback(
        (saleProduct: UpdateProductSale) => {
            setInvoiceProductsServices({
                ...invoiceProductServices,
                vendasProduto: invoiceProductServices.vendasProduto.filter(
                    ({ produtoId }) => produtoId !== saleProduct.produtoId
                ),
            });
        },
        [invoiceProductServices]
    );

    const removeSaleService = useCallback(
        (saleService: UpdateServiceSale) => {
            setInvoiceProductsServices({
                ...invoiceProductServices,
                vendasServico: invoiceProductServices.vendasServico.filter(
                    ({ servicoId }) => servicoId !== saleService.servicoId
                ),
            });
        },
        [invoiceProductServices]
    );

    const addOrUpdateSaleProduct = useCallback(
        (saleProduct: UpdateProductSale) => {
            const productAlreadyExist = invoiceProductServices.vendasProduto.some(
                ({ produtoId }) => produtoId === saleProduct.produtoId
            );

            if (productAlreadyExist && !saleProductUpdating) return setPerigo("Este produto já existe na nota.");

            if (!saleProductUpdating) {
                setInvoiceProductsServices({
                    ...invoiceProductServices,
                    vendasProduto: [...invoiceProductServices.vendasProduto, saleProduct],
                });
                return setShowAddSaleProduct(false);
            }

            setInvoiceProductsServices({
                ...invoiceProductServices,
                vendasProduto: invoiceProductServices.vendasProduto.map((vp) =>
                    vp.produtoId === saleProductUpdating.produtoId ? saleProduct : vp
                ),
            });
            setSaleProductUpdating(null);
        },
        [setPerigo, invoiceProductServices, saleProductUpdating]
    );

    const addOrUpdateSaleService = useCallback(
        (saleService: UpdateServiceSale) => {
            const serviceAlreadyExist = invoiceProductServices.vendasServico.some(
                ({ servicoId }) => servicoId === saleService.servicoId
            );

            if (serviceAlreadyExist && !saleServiceUpdating) return setPerigo("Este serviço já existe na nota.");

            if (!saleServiceUpdating) {
                setInvoiceProductsServices({
                    ...invoiceProductServices,
                    vendasServico: [...invoiceProductServices.vendasServico, saleService],
                });
                return setShowAddSaleService(false);
            }

            setInvoiceProductsServices({
                ...invoiceProductServices,
                vendasServico: invoiceProductServices.vendasServico.map((vs) =>
                    vs.servicoId === saleServiceUpdating.servicoId ? saleService : vs
                ),
            });
            setSaleServiceUpdating(null);
        },
        [setPerigo, invoiceProductServices, saleServiceUpdating]
    );

    const handleOnSubmit = useCallback(
        (saleInvoiceData: UpdateSaleInvoice, helpers: FormikHelpers<UpdateSaleInvoice>) => {
            if (saleInvoiceData.datasBoleto.length !== saleInvoiceData.formaParcelamento)
                helpers.setErrors({
                    formaParcelamento: "O número de datas de boleto deve corresponder com este valor.",
                });

            if (invoiceProductServices.vendasProduto.length < 1 && invoiceProductServices.vendasServico.length < 1)
                return helpers.setErrors({
                    vendasProduto: "Adicione ao menos um produto.",
                    vendasServico: "Adicione ao menos um serviço.",
                });

            onSubmit({ ...saleInvoiceData, ...invoiceProductServices });
            helpers.setSubmitting(false);
            helpers.resetForm();
            setInvoiceProductsServices({ vendasProduto: [], vendasServico: [] });
        },
        [onSubmit, invoiceProductServices]
    );

    const resetAndHide = useCallback(() => {
        setAddedProduct(false);
        setAddedService(false);
        if (onHide) onHide();
    }, [onHide]);

    return (
        <>
            <OffcanvasForm.Root show={props.show} onHide={resetAndHide}>
                <OffcanvasForm.Header>
                    <OffcanvasForm.Title>{"Editar Nota Fiscal"}</OffcanvasForm.Title>
                </OffcanvasForm.Header>
                <OffcanvasForm.Body>
                    <OffcanvasForm.Formik
                        validateOnChange={false}
                        validationSchema={yupSaleInvoiceSchema}
                        initialValues={initialValues}
                        onSubmit={handleOnSubmit}
                    >
                        {({ values, errors, setValues }) => {
                            const arrNumDatasBoleto = new Array(values.formaParcelamento).fill(undefined);

                            const valorCustoNota = valorCustoTotalProduto + valorCustoTotalServico;
                            const valorMarkupNota = ((values.markup ?? 1) * valorCustoNota) / 100;
                            const valorVendaNota = valorCustoNota + ((values.markup ?? 0) * valorCustoNota) / 100;

                            const valorMarkupLiquido = valorMarkupNota - (values.dedutiveisDistribuidor ?? 0);
                            const valorNota =
                                values.tipoFaturamento === "DIRETO"
                                    ? ((values.impostoNota ?? 0) * valorMarkupLiquido) / 100
                                    : ((values.impostoNota ?? 0) * valorVendaNota) / 100;

                            const valorImpostos = 0 + valorNota;
                            const valorMargem = valorMarkupLiquido - valorImpostos;

                            setAddedProduct(invoiceProductServices.vendasProduto.length > 0);
                            setAddedService(invoiceProductServices.vendasServico.length > 0);

                            const atualizaMarkupPorValorVenda = (valor: number) => {
                                if (valorCustoNota === 0) return setAviso("O custo não pode ser 0.");
                                const novoValorMarkup = valor - valorCustoNota;
                                const novoMarkup = (novoValorMarkup * 100) / valorCustoNota;
                                setValues({ ...values, markup: novoMarkup });
                            };
                            const findPorcentMarkup = (valor: number) => {
                                if (valorCustoNota === 0) setAviso("O custo não pode ser 0.");
                                return valorCustoNota !== 0 ? (valor * 100) / valorCustoNota : 0;
                            };

                            const findPorcentImpNota = (valor: number) => {
                                switch (values.tipoFaturamento) {
                                    case RevenueType.DIRETO:
                                        if (valorMarkupLiquido === 0) setAviso("O markup líquido não pode ser 0.");
                                        return valorMarkupLiquido !== 0 ? (valor * 100) / valorMarkupLiquido : 0;
                                    case RevenueType.REVENDA:
                                        if (valorVendaNota === 0) setAviso("O valor da venda não pode ser 0.");
                                        return valorVendaNota !== 0 ? (valor * 100) / valorVendaNota : 0;
                                    default:
                                        if (values.tipoFaturamento === null)
                                            setValues({
                                                ...values,
                                                tipoFaturamento: RevenueType.DIRETO,
                                                dedutiveisDistribuidor: 0,
                                            });
                                        return 0;
                                }
                            };

                            return (
                                <Stack className="d-flex w-100 gap-3 py-3">
                                    <div className="d-flex flex-column gap-2 px-3">
                                        <h6>Sobre a nota</h6>
                                        <FormGroupInput
                                            label="Código da Nota"
                                            type={FormGroupInputType.TEXT}
                                            value={values.codigo ?? ""}
                                            setValue={(codigo) => setValues({ ...values, codigo })}
                                            error={errors.codigo}
                                        />
                                        <FormGroupInput
                                            required
                                            label="Núm. Oportunidade CRM"
                                            type={FormGroupInputType.TEXT}
                                            value={values.numOportunidadeCRM ?? ""}
                                            setValue={(numOportunidadeCRM) =>
                                                setValues({ ...values, numOportunidadeCRM })
                                            }
                                            error={errors.numOportunidadeCRM}
                                        />
                                        <FormGroupInput
                                            stringNullable
                                            label="Núm. Pedido Distribuidor"
                                            type={FormGroupInputType.TEXT}
                                            value={values.numPedidoDistribuidor ?? ""}
                                            setValue={(numPedidoDistribuidor) =>
                                                setValues({ ...values, numPedidoDistribuidor })
                                            }
                                            error={errors.numPedidoDistribuidor}
                                        />
                                        <FormGroupInput
                                            label="Data da Nota (CRM)"
                                            type={FormGroupInputType.DATE}
                                            sm="6"
                                            value={values.dataFaturamento}
                                            setValue={(dataFaturamento) => setValues({ ...values, dataFaturamento })}
                                            error={errors.dataFaturamento as string}
                                        />
                                        <FormGroupSelect
                                            label="Tipo de faturamento"
                                            value={values.tipoFaturamento ?? RevenueType.DIRETO}
                                            setValue={(tipoFaturamento) => {
                                                setValues({ ...values, tipoFaturamento, dedutiveisDistribuidor: 0 });
                                            }}
                                            options={utils.retornaArrayTipoFaturamento()}
                                            optionTextFn={utils.retornaTextoTipoFaturamento}
                                            error={
                                                values.tipoFaturamento ? undefined : "Selecione um tipo de faturamento."
                                            }
                                        />
                                        <ButtonAddInvoice />
                                    </div>

                                    {(hasProduct || isNewSale) && !addedService && (
                                        <div className="d-flex flex-column gap-2 p-3 border-top">
                                            <Form.Group controlId={v4()}>
                                                <Form.Label as="h6">Produtos</Form.Label>
                                                <Form.Control isInvalid={!!errors.vendasProduto} className="d-none" />
                                                <Form.Control.Feedback type="invalid">
                                                    {String(errors.vendasProduto)}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <ListSaleProducts
                                                saleProducts={invoiceProductServices.vendasProduto}
                                                products={products}
                                                onClickAdd={() => {
                                                    setAddedProduct(true);
                                                    setShowAddSaleProduct(true);
                                                }}
                                                onClickEdit={setSaleProductUpdating}
                                                onClickDelete={removeSaleProduct}
                                                saleTotalValue={setValorCustoTotalProduto}
                                            />
                                        </div>
                                    )}

                                    {(hasService || isNewSale) && !addedProduct && (
                                        <div className="d-flex flex-column gap-2 p-3 border-top">
                                            <Form.Group controlId={v4()}>
                                                <Form.Label as="h6">Serviços</Form.Label>
                                                <Form.Control isInvalid={!!errors.vendasServico} className="d-none" />
                                                <Form.Control.Feedback type="invalid">
                                                    {String(errors.vendasServico)}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <ListSaleServices
                                                saleServices={invoiceProductServices.vendasServico}
                                                services={services}
                                                onClickAdd={() => {
                                                    setAddedService(true);
                                                    setShowAddSaleService(true);
                                                }}
                                                onClickEdit={setSaleServiceUpdating}
                                                onClickDelete={removeSaleService}
                                                saleTotalValue={setValorCustoTotalServico}
                                            />
                                        </div>
                                    )}

                                    <Row className="d-flex p-3 row-gap-2 border-top">
                                        <h6>
                                            Valores da Venda (
                                            {utils.retornaTextoTipoFaturamento(
                                                values.tipoFaturamento ?? RevenueType.DIRETO
                                            )}
                                            )
                                        </h6>

                                        <FormGroupInput
                                            label="Markup Bruto %"
                                            sm="6"
                                            type={FormGroupInputType.PORCENT}
                                            value={values.markup ?? 0}
                                            setValue={(markup) => setValues({ ...values, markup })}
                                            error={errors.markup}
                                        />
                                        <FormGroupInput
                                            label="Markup Bruto"
                                            sm="6"
                                            type={FormGroupInputType.MONETARY}
                                            tipoMoeda={CurrencyType.BRL}
                                            value={valorMarkupNota}
                                            setValue={(valor) =>
                                                setValues({ ...values, markup: findPorcentMarkup(valor) })
                                            }
                                        />
                                        <FormGroupInput
                                            label="Venda"
                                            sm="12"
                                            type={FormGroupInputType.MONETARY}
                                            tipoMoeda={CurrencyType.BRL}
                                            value={valorVendaNota}
                                            setValue={(valorVenda) => atualizaMarkupPorValorVenda(valorVenda)}
                                        />
                                    </Row>

                                    {values.tipoFaturamento === "DIRETO" && (
                                        <Row className="d-flex p-3 row-gap-2 border-top">
                                            <h6>Dedutíveis e Impostos de Fornecimento</h6>

                                            <FormGroupInput
                                                label="Dedutíveis distribuidor"
                                                sm="6"
                                                type={FormGroupInputType.MONETARY}
                                                tipoMoeda={CurrencyType.BRL}
                                                error={errors.dedutiveisDistribuidor}
                                                value={values.dedutiveisDistribuidor ?? 0}
                                                setValue={(dedutiveisDistribuidor) =>
                                                    setValues({ ...values, dedutiveisDistribuidor })
                                                }
                                            />
                                            <FormGroupInput
                                                label={
                                                    <>
                                                        Markup Líquido
                                                        <OverlayTrigger
                                                            overlay={<Tooltip>{INFO_MARKUP_LIQUIDO}</Tooltip>}
                                                        >
                                                            <i className="bi bi-question-circle-fill text-primary ms-1" />
                                                        </OverlayTrigger>
                                                    </>
                                                }
                                                type={FormGroupInputType.MONETARY}
                                                sm="6"
                                                tipoMoeda={CurrencyType.BRL}
                                                value={valorMarkupLiquido}
                                                setValue={(markupLiquido) =>
                                                    setValues({
                                                        ...values,
                                                        dedutiveisDistribuidor: valorMarkupNota - markupLiquido,
                                                    })
                                                }
                                            />
                                        </Row>
                                    )}

                                    <Row className="d-flex p-3 row-gap-2 border-top">
                                        <h6>Tributos Referentes à Nota Fiscal da Revenda</h6>

                                        <FormGroupInput
                                            label="Imposto Nota %"
                                            type={FormGroupInputType.PORCENT}
                                            sm="6"
                                            value={values.impostoNota ?? 0}
                                            setValue={(impostoNota) => setValues({ ...values, impostoNota })}
                                            error={errors.impostoNota}
                                        />
                                        <FormGroupInput
                                            label="Imposto Nota"
                                            type={FormGroupInputType.MONETARY}
                                            tipoMoeda={CurrencyType.BRL}
                                            sm="6"
                                            value={valorNota}
                                            setValue={(valor) =>
                                                setValues({ ...values, impostoNota: findPorcentImpNota(valor) })
                                            }
                                        />

                                        <div className="d-flex flex-column text-secondary-dark">
                                            <small>
                                                Impostos: {utils.retornaValorMonetario(valorImpostos, CurrencyType.BRL)}
                                            </small>
                                            <small>
                                                Margem: {utils.retornaValorMonetario(valorMargem, CurrencyType.BRL)}
                                            </small>
                                        </div>
                                    </Row>

                                    <Row className="d-flex row-gap-2 p-3 border-top">
                                        <h6>Pagamento</h6>
                                        <FormGroupGeneric label="Forma de pagamento" error={errors.formaPagamentoId}>
                                            <SelectFormaPagamento
                                                idSelecionado={values.formaPagamentoId}
                                                setIdSelecionado={(id) =>
                                                    setValues({ ...values, formaPagamentoId: id as string })
                                                }
                                            />
                                        </FormGroupGeneric>

                                        <FormGroupInput
                                            label="Número de parcelas"
                                            type={FormGroupInputType.NUMBER}
                                            min={1}
                                            value={values.formaParcelamento}
                                            setValue={(formaParcelamento) =>
                                                setValues({
                                                    ...values,
                                                    formaParcelamento,
                                                    datasBoleto: new Array(formaParcelamento)
                                                        .fill(0)
                                                        .map(
                                                            (_, index) =>
                                                                values.datasBoleto.at(index) ??
                                                                utils.retornaDataAtual({ mesesAdicionais: index })
                                                        ),
                                                })
                                            }
                                            error={errors.formaParcelamento}
                                        />
                                        {arrNumDatasBoleto.map((_, index) => (
                                            <FormGroupInput
                                                key={index}
                                                sm="6"
                                                label={`Boleto #${index + 1}`}
                                                type={FormGroupInputType.DATE}
                                                value={values.datasBoleto[index]}
                                                setValue={(dataBoleto) =>
                                                    setValues({
                                                        ...values,
                                                        datasBoleto: values.datasBoleto.map((existente, idx) =>
                                                            idx === index ? dataBoleto : existente
                                                        ),
                                                    })
                                                }
                                                error={errors.datasBoleto as string}
                                            />
                                        ))}
                                        <ButtonAddTicket />
                                    </Row>
                                </Stack>
                            );
                        }}
                    </OffcanvasForm.Formik>
                </OffcanvasForm.Body>
                <OffcanvasForm.Footer>
                    <OffcanvasForm.Reset variant="outline-secondary-dark">Cancelar</OffcanvasForm.Reset>
                    <OffcanvasForm.Submit>{"Editar"}</OffcanvasForm.Submit>
                </OffcanvasForm.Footer>
            </OffcanvasForm.Root>

            <ManageSaleProduct
                products={products}
                show={showAddSaleProduct || !!saleProductUpdating}
                onSubmit={addOrUpdateSaleProduct}
                saleProductUpdating={saleProductUpdating}
                onHide={() => {
                    setShowAddSaleProduct(false);
                    setSaleProductUpdating(null);
                }}
            />

            <ManageSaleService
                services={services}
                show={showAddSaleService || !!saleServiceUpdating}
                onSubmit={addOrUpdateSaleService}
                saleServiceUpdating={saleServiceUpdating}
                onHide={() => {
                    setShowAddSaleService(false);
                    setSaleServiceUpdating(null);
                }}
            />
        </>
    );
}

function ListSaleProducts(props: {
    saleProducts: UpdateProductSale[];
    products: Product[];
    onClickAdd: () => void;
    onClickEdit: (saleProduct: UpdateProductSale) => void;
    onClickDelete: (saleProduct: UpdateProductSale) => void;
    saleTotalValue: (saleValue: number) => void;
}) {
    const saleValue = props.saleProducts.reduce((acc, vendaProduto) => {
        const custoTotalReal = vendaProduto.valorCustoUnit * vendaProduto.quantidade * vendaProduto.cotacao;
        return (acc += custoTotalReal);
    }, 0);
    props.saleTotalValue(saleValue);

    return (
        <Stack className="gap-2">
            {props.saleProducts.map((vendaProduto) => {
                const produto = props.products.find(({ id }) => id === vendaProduto.produtoId);
                return (
                    <div key={v4()}>
                        <Stack className="d-flex w-100 position-relative border rounded shadow-sm p-2">
                            <div className="position-absolute end-0 top-0 mt-1 me-1 z-1">
                                <BotaoFechar onClick={() => props.onClickDelete(vendaProduto)} />
                            </div>
                            <BotaoLabel
                                variant="info"
                                texto={produto?.name ?? "--Nenhum--"}
                                onClick={() => props.onClickEdit(vendaProduto)}
                            />
                            <div className="d-flex w-100 justify-content-between">
                                <small>Qntd.</small>
                                <small>{vendaProduto.quantidade}</small>
                            </div>
                        </Stack>
                    </div>
                );
            })}
            <div className="text-secondary-dark">
                <small>Valor venda: {StringUtil.getCurrencyFormat(saleValue, CurrencyType.BRL)}</small>
            </div>
            <div className="text-end">
                <Button className="rounded-pill" size="sm" onClick={props.onClickAdd}>
                    Adicionar Produto
                </Button>
            </div>
        </Stack>
    );
}

function ListSaleServices(props: {
    saleServices: UpdateServiceSale[];
    services: Service[];
    onClickAdd: () => void;
    onClickEdit: (saleService: UpdateServiceSale) => void;
    onClickDelete: (saleService: UpdateServiceSale) => void;
    saleTotalValue: (saleValue: number) => void;
}) {
    const saleValue = props.saleServices.reduce((acc, vendaServico) => {
        const servico = props.services.find(({ id }) => id === vendaServico.servicoId);
        const custoHora = servico?.valorCustoHora ?? 0;
        const custoHoraReal = vendaServico.cotacao * custoHora;
        const custoTotal =
            vendaServico.qntdHorasComercial * custoHoraReal +
            vendaServico.qntdHorasNaoComercial * custoHoraReal * 1.5 +
            vendaServico.qntdHorasEspecial * custoHoraReal * 2;

        return (acc += custoTotal);
    }, 0);
    props.saleTotalValue(saleValue);

    return (
        <Stack className="gap-2">
            {props.saleServices.map((vendaServico) => {
                const servico = props.services.find(({ id }) => id === vendaServico.servicoId);
                const horasTotais =
                    vendaServico.qntdHorasComercial +
                    vendaServico.qntdHorasNaoComercial +
                    vendaServico.qntdHorasEspecial;

                return (
                    <div key={v4()}>
                        <Stack className="d-flex w-100 position-relative border rounded shadow-sm p-2 ">
                            <div className="position-absolute end-0 top-0 mt-1 me-1 z-1">
                                <BotaoFechar onClick={() => props.onClickDelete(vendaServico)} />
                            </div>
                            <BotaoLabel
                                variant="info"
                                texto={servico?.name ?? "--Nenhum--"}
                                onClick={() => props.onClickEdit(vendaServico)}
                            />
                            <div className="d-flex w-100 justify-content-between">
                                <small>Horas totais</small>
                                <small>{horasTotais}</small>
                            </div>
                        </Stack>
                    </div>
                );
            })}
            <div className="text-secondary-dark">
                <small>Valor venda: {StringUtil.getCurrencyFormat(saleValue, CurrencyType.BRL)}</small>
            </div>
            <div className="text-end">
                <Button className="rounded-pill" size="sm" onClick={props.onClickAdd}>
                    Adicionar Serviço
                </Button>
            </div>
        </Stack>
    );
}

//ESQUEMA YUP
export const yupSaleInvoiceSchema: yup.ObjectSchema<UpdateSaleInvoice> = yup.object({
    codigo: yup.string().required("Este campo é obrigatório.").nullable(),
    formaParcelamento: yup
        .number()
        .min(1, "O formaParcelamento mínimo é 1.")
        .integer("O formaParcelamento deve ser inteiro.")
        .required("Deve ser passado o formaParcelamento."),
    dataFaturamento: yup.date().required("Este campo é necessário."),
    formaPagamentoId: yup.string().required("Selecione uma forma de pagamento."),
    datasBoleto: yup.array(yup.date().required("Este campo é necessário.")).required("Esta campo é necessário."),
    numOportunidadeCRM: yup.string().defined("Passar numero CRM da nota").nullable(),
    numPedidoDistribuidor: yup.string().defined("Inserir Núm. Pedido Distribuidor na Nota Fiscal").nullable(),
    dedutiveisDistribuidor: yup.number().defined("Inserir dedutíveis na Nota Fiscal").nullable(),
    tipoFaturamento: yup
        .mixed<RevenueType>()
        .oneOf(Object.values(RevenueType))
        .defined("Inserir tipo de faturamento na Nota Fiscal")
        .nullable(),
    impostoNota: yup.number().defined("Inserir imposto na Nota Fiscal").nullable(),
    markup: yup.number().defined("Este campo é necessário.").nullable(),
    vendasProduto: yup.array(yupSaleProductSchema).required("Este campo é necessário."),
    vendasServico: yup.array(yupSaleServiceSchema).required("Este campo é necessário."),
});
