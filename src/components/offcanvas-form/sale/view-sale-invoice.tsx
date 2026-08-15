import FormGroupInput, { FormGroupInputType } from "../../formGroups/FormGroupInput";
import FormGroupSelect from "../../formGroups/FormGroupSelect";
import useService from "../../../hooks/use-service";
import StringUtil from "../../../utils/string.util";
import useProduct from "../../../hooks/use-product";

import utils from "../../../utils";

import { useContext, useEffect, useMemo, useState } from "react";
import { Form, OverlayTrigger, Row, Stack, Tooltip } from "react-bootstrap";
import { UpdateSaleInvoice } from "../../../types/sale-invoice";
import { UpdateProductSale } from "../../../types/sale-product";
import { UpdateServiceSale } from "../../../types/sale-service";
import { ContextAlerta } from "../../../contexts/ContextAlert";
import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { CurrencyType } from "../../../types/commom";
import { RevenueType } from "../../../types/sale";
import { Service } from "../../../types/service";
import { Product } from "../../../types/product";
import { v4 } from "uuid";

export const INFO_MARKUP_LIQUIDO =
    "Valor de comissão listado no site do distribuidor referente à comissão a ser paga para a revenda.";

type ViewSaleInvoiceProps = {
    onHide?: () => void;
    saleInvoiceUpdating?: UpdateSaleInvoice | null;
    show?: boolean;
};

export default function ViewSaleInvoice({ onHide, saleInvoiceUpdating, ...props }: ViewSaleInvoiceProps) {
    const { setAviso } = useContext(ContextAlerta);

    const [valorCustoTotalProduto, setValorCustoTotalProduto] = useState(0);
    const [valorCustoTotalServico, setValorCustoTotalServico] = useState(0);

    const { findManyServices, cancelFindManyServices } = useService();
    const [services, setServicos] = useState<Service[]>([]);

    const { findManyProducts, cancelFindManyProducts } = useProduct();
    const [products, setProdutos] = useState<Product[]>([]);

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

    useEffect(() => {
        findManyProducts().then(setProdutos).catch(console.error);
        findManyServices().then(setServicos).catch(console.error);
        return () => {
            cancelFindManyProducts();
            cancelFindManyServices();
        };
    }, [cancelFindManyProducts, findManyProducts, cancelFindManyServices, findManyServices, setAviso]);

    return (
        <OffcanvasForm.Root show={props.show} onHide={onHide}>
            <OffcanvasForm.Header>
                <OffcanvasForm.Title>{"Visualizar Nota Fiscal"}</OffcanvasForm.Title>
            </OffcanvasForm.Header>
            <OffcanvasForm.Body>
                <OffcanvasForm.Formik validateOnChange={false} initialValues={initialValues} onSubmit={() => {}}>
                    {({ values }) => {
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

                        return (
                            <Stack className="d-flex w-100 gap-3 py-3">
                                <div className="d-flex flex-column gap-2 px-3">
                                    <h6>Sobre a nota</h6>
                                    <FormGroupInput
                                        disabled
                                        label="Código da Nota"
                                        type={FormGroupInputType.TEXT}
                                        value={values.codigo ?? ""}
                                        setValue={() => {}}
                                    />
                                    <FormGroupInput
                                        disabled
                                        label="Núm. Oportunidade CRM"
                                        type={FormGroupInputType.TEXT}
                                        value={values.numOportunidadeCRM ?? ""}
                                        setValue={() => {}}
                                    />
                                    <FormGroupInput
                                        disabled
                                        label="Núm. Pedido Distribuidor"
                                        type={FormGroupInputType.TEXT}
                                        value={values.numPedidoDistribuidor ?? ""}
                                        setValue={() => {}}
                                    />
                                    <FormGroupInput
                                        disabled
                                        label="Data da Nota (CRM)"
                                        type={FormGroupInputType.DATE}
                                        sm="6"
                                        value={values.dataFaturamento}
                                        setValue={() => {}}
                                    />
                                    <FormGroupSelect
                                        disabled
                                        label="Tipo de faturamento"
                                        value={values.tipoFaturamento ?? RevenueType.DIRETO}
                                        setValue={() => {}}
                                        options={utils.retornaArrayTipoFaturamento()}
                                        optionTextFn={utils.retornaTextoTipoFaturamento}
                                    />
                                </div>

                                {(hasProduct || isNewSale) && (
                                    <div className="d-flex flex-column gap-2 p-3 border-top">
                                        <Form.Group controlId={v4()}>
                                            <Form.Label as="h6">Produtos</Form.Label>
                                        </Form.Group>
                                        <ListSaleProducts
                                            saleProducts={initialValues.vendasProduto}
                                            products={products}
                                            saleTotalValue={setValorCustoTotalProduto}
                                        />
                                    </div>
                                )}

                                {(hasService || isNewSale) && (
                                    <div className="d-flex flex-column gap-2 p-3 border-top">
                                        <Form.Group controlId={v4()}>
                                            <Form.Label as="h6">Serviços</Form.Label>
                                        </Form.Group>
                                        <ListSaleServices
                                            saleServices={initialValues.vendasServico}
                                            services={services}
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
                                        disabled
                                        label="Markup Bruto %"
                                        sm="6"
                                        type={FormGroupInputType.PORCENT}
                                        value={values.markup ?? 0}
                                        setValue={() => {}}
                                    />
                                    <FormGroupInput
                                        disabled
                                        label="Markup Bruto"
                                        sm="6"
                                        type={FormGroupInputType.MONETARY}
                                        tipoMoeda={CurrencyType.BRL}
                                        value={valorMarkupNota}
                                        setValue={() => {}}
                                    />
                                    <FormGroupInput
                                        disabled
                                        label="Venda"
                                        sm="12"
                                        type={FormGroupInputType.MONETARY}
                                        tipoMoeda={CurrencyType.BRL}
                                        value={valorVendaNota}
                                        setValue={() => {}}
                                    />
                                </Row>

                                {values.tipoFaturamento === "DIRETO" && (
                                    <Row className="d-flex p-3 row-gap-2 border-top">
                                        <h6>Dedutíveis e Impostos de Fornecimento</h6>

                                        <FormGroupInput
                                            disabled
                                            label="Dedutíveis distribuidor"
                                            sm="6"
                                            type={FormGroupInputType.MONETARY}
                                            tipoMoeda={CurrencyType.BRL}
                                            value={values.dedutiveisDistribuidor ?? 0}
                                            setValue={() => {}}
                                        />
                                        <FormGroupInput
                                            disabled
                                            label={
                                                <>
                                                    Markup Líquido
                                                    <OverlayTrigger overlay={<Tooltip>{INFO_MARKUP_LIQUIDO}</Tooltip>}>
                                                        <i className="bi bi-question-circle-fill text-primary ms-1" />
                                                    </OverlayTrigger>
                                                </>
                                            }
                                            type={FormGroupInputType.MONETARY}
                                            sm="6"
                                            tipoMoeda={CurrencyType.BRL}
                                            value={valorMarkupLiquido}
                                            setValue={() => {}}
                                        />
                                    </Row>
                                )}

                                <Row className="d-flex p-3 row-gap-2 border-top">
                                    <h6>Tributos Referentes à Nota Fiscal da Revenda</h6>

                                    <FormGroupInput
                                        disabled
                                        label="Imposto Nota %"
                                        type={FormGroupInputType.PORCENT}
                                        sm="6"
                                        value={values.impostoNota ?? 0}
                                        setValue={() => {}}
                                    />
                                    <FormGroupInput
                                        disabled
                                        label="Imposto Nota"
                                        type={FormGroupInputType.MONETARY}
                                        tipoMoeda={CurrencyType.BRL}
                                        sm="6"
                                        value={valorNota}
                                        setValue={() => {}}
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
                                    <FormGroupInput
                                        disabled
                                        label="Número de parcelas"
                                        type={FormGroupInputType.NUMBER}
                                        min={1}
                                        value={values.formaParcelamento}
                                        setValue={() => {}}
                                    />
                                    {arrNumDatasBoleto.map((_, index) => (
                                        <FormGroupInput
                                            disabled
                                            key={index}
                                            sm="6"
                                            label={`Boleto #${index + 1}`}
                                            type={FormGroupInputType.DATE}
                                            value={values.datasBoleto[index]}
                                            setValue={() => {}}
                                        />
                                    ))}
                                </Row>
                            </Stack>
                        );
                    }}
                </OffcanvasForm.Formik>
            </OffcanvasForm.Body>
            <OffcanvasForm.Footer>
                <OffcanvasForm.Reset variant="outline-secondary-dark">Fechar</OffcanvasForm.Reset>
            </OffcanvasForm.Footer>
        </OffcanvasForm.Root>
    );
}

function ListSaleProducts(props: {
    saleProducts: UpdateProductSale[];
    products: Product[];
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
                return (
                    <div key={v4()}>
                        <Stack className="d-flex w-100 position-relative border rounded shadow-sm p-2">
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
        </Stack>
    );
}

function ListSaleServices(props: {
    saleServices: UpdateServiceSale[];
    services: Service[];
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
                const horasTotais =
                    vendaServico.qntdHorasComercial +
                    vendaServico.qntdHorasNaoComercial +
                    vendaServico.qntdHorasEspecial;

                return (
                    <div key={v4()}>
                        <Stack className="d-flex w-100 position-relative border rounded shadow-sm p-2">
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
        </Stack>
    );
}
