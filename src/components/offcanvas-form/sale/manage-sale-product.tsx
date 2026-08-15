import FormGroupInput, { FormGroupInputType } from "../../formGroups/FormGroupInput";
import FormGroupGeneric from "../../formGroups/FormGroupGeneric";
import FormGroupSelect from "../../formGroups/FormGroupSelect";
import SelectFornecedor from "../../selects/SelectFornecedor";
import SelectProduto from "../../selects/SelectProduto";
import utils from "../../../utils";

import { UpdateProductSale } from "../../../types/sale-product";
import { getUSDtoBRLRate } from "../../../utils/exchange.util";
import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { CurrencyType } from "../../../types/commom";
import { RevenueType } from "../../../types/sale";
import { Product } from "../../../types/product";
import { Row, Stack } from "react-bootstrap";
import { FormikHelpers } from "formik";
import { useCallback } from "react";

import * as yup from "yup";

type ManageSaleProductProps = {
    onHide?: () => void;
    onSubmit: (values: UpdateProductSale) => void;
    saleProductUpdating?: UpdateProductSale | null;
    products: Product[]; // Array de IDs de produtos já adicionados na nota fiscal
    show?: boolean;
};

export default function ManageSaleProduct({
    onHide,
    onSubmit,
    saleProductUpdating,
    products,
    show,
}: ManageSaleProductProps) {
    const initialValue: UpdateProductSale = saleProductUpdating ?? {
        cotacao: 1,
        tipoMoeda: CurrencyType.BRL,
        produtoId: "",
        quantidade: 1,
        valorCustoUnit: 0,
        fornecedoresId: [],
        dedutiveisDistribuidor: null,
        impostoNota: null,
        markup: null,
        tipoFaturamento: null,
    };

    const handleOnSubmit = useCallback(
        async (vendaProduto: UpdateProductSale, helpers: FormikHelpers<UpdateProductSale>) => {
            onSubmit(vendaProduto);
            helpers.setSubmitting(false);
            helpers.resetForm();
        },
        [onSubmit]
    );

    return (
        <OffcanvasForm.Root show={show} onHide={onHide}>
            <OffcanvasForm.Header>
                <OffcanvasForm.Title>{"Editar produto da nota fiscal"}</OffcanvasForm.Title>
            </OffcanvasForm.Header>
            <OffcanvasForm.Body>
                <OffcanvasForm.Formik
                    validateOnChange={false}
                    initialValues={initialValue}
                    onSubmit={handleOnSubmit}
                    validationSchema={yupSaleProductSchema}
                >
                    {({ values, errors, setValues }) => {
                        const atualizaTipoMoeda = (tipoMoedaParam: CurrencyType) => {
                            if (values.tipoMoeda === tipoMoedaParam) return;
                            if (tipoMoedaParam === null)
                                return setValues({ ...values, tipoMoeda: CurrencyType.BRL, cotacao: 1 });
                            if (tipoMoedaParam === CurrencyType.BRL)
                                return setValues({ ...values, tipoMoeda: tipoMoedaParam, cotacao: 1 });
                            getUSDtoBRLRate()
                                .then((rate) => {
                                    if (!rate || isNaN(rate))
                                        return setValues({ ...values, tipoMoeda: tipoMoedaParam });
                                    setValues({ ...values, tipoMoeda: tipoMoedaParam, cotacao: rate });
                                })
                                .catch(() => {
                                    setValues({ ...values, tipoMoeda: tipoMoedaParam });
                                });
                        };

                        const atualizaCustoUnitario = (custoUnit: number) => {
                            if (values.valorCustoUnit === custoUnit) return;
                            if (0 === custoUnit) return;
                            else setValues({ ...values, valorCustoUnit: custoUnit });
                        };

                        const produtos = products.find(({ id }) => id === values.produtoId);
                        const custoUnit = produtos?.custoUnit ?? 0;
                        atualizaCustoUnitario(custoUnit);

                        const tipoMoeda = produtos?.tipoMoeda ?? CurrencyType.BRL;
                        atualizaTipoMoeda(tipoMoeda);

                        const cotacaoDesabilitada = tipoMoeda === "BRL";
                        const custoPExiste = values.produtoId && custoUnit >= 0.01 ? true : false;
                        const valorCusto = values.quantidade * values.valorCustoUnit;

                        return (
                            <Stack className="d-flex gap-3 py-3 w-100">
                                <div className="d-flex flex-column px-3 gap-2">
                                    <h6>Produto</h6>
                                    <FormGroupGeneric label="Produto" error={errors.produtoId}>
                                        <SelectProduto
                                            idSelecionado={values.produtoId}
                                            setIdSelecionado={(id) => setValues({ ...values, produtoId: id as string })}
                                        />
                                    </FormGroupGeneric>
                                    <FormGroupGeneric label="Fornecedores" error={errors.fornecedoresId as string}>
                                        <SelectFornecedor
                                            idsSelecionados={values.fornecedoresId}
                                            setIdsSelecionados={(fornecedoresId) =>
                                                setValues({ ...values, fornecedoresId })
                                            }
                                        />
                                    </FormGroupGeneric>
                                </div>
                                <Row className="d-flex p-3 row-gap-2 border-top">
                                    <h6>Valores do Produto</h6>
                                    <FormGroupInput
                                        disabled={custoPExiste}
                                        sm="7"
                                        label="Custo (unitário)"
                                        type={FormGroupInputType.MONETARY}
                                        tipoMoeda={tipoMoeda}
                                        value={values.valorCustoUnit}
                                        setValue={(valorCustoUnit) => setValues({ ...values, valorCustoUnit })}
                                        error={errors.valorCustoUnit}
                                    />
                                    <FormGroupInput
                                        sm="5"
                                        label="Cotação"
                                        type={FormGroupInputType.MONETARY}
                                        disabled={cotacaoDesabilitada}
                                        tipoMoeda={CurrencyType.BRL}
                                        value={values.cotacao ?? 1}
                                        setValue={(cotacao) => setValues({ ...values, cotacao })}
                                        error={errors.cotacao}
                                    />
                                    <FormGroupInput
                                        sm="5"
                                        label="Quantidade"
                                        type={FormGroupInputType.NUMBER}
                                        min={1}
                                        value={values.quantidade}
                                        setValue={(quantidade) => setValues({ ...values, quantidade })}
                                        error={errors.quantidade}
                                    />

                                    <small className="text-secondary-dark">
                                        Custo: {utils.retornaValorMonetario(valorCusto, tipoMoeda)}
                                    </small>

                                    <div className="d-flex flex-column gap-2 border-top p-3">
                                        <h6>Registros Antigos</h6>
                                        {values.markup !== null && (
                                            <FormGroupInput
                                                disabled
                                                label="Markup Bruto %"
                                                sm="6"
                                                type={FormGroupInputType.PORCENT}
                                                value={values.markup}
                                                setValue={(markup) => setValues({ ...values, markup })}
                                                error={errors.markup}
                                            />
                                        )}
                                        {values.tipoFaturamento === "DIRETO" ||
                                            (values.tipoFaturamento === null &&
                                                values.dedutiveisDistribuidor !== null && (
                                                    <FormGroupInput
                                                        disabled
                                                        label="Dedutíveis distribuidor"
                                                        sm="6"
                                                        type={FormGroupInputType.MONETARY}
                                                        tipoMoeda={CurrencyType.BRL}
                                                        error={errors.dedutiveisDistribuidor}
                                                        value={values.dedutiveisDistribuidor}
                                                        setValue={(dedutiveisDistribuidor) =>
                                                            setValues({ ...values, dedutiveisDistribuidor })
                                                        }
                                                    />
                                                ))}
                                        {values.impostoNota !== null && (
                                            <FormGroupInput
                                                disabled
                                                label="Imposto Nota %"
                                                type={FormGroupInputType.PORCENT}
                                                sm="6"
                                                value={values.impostoNota}
                                                setValue={(impostoNota) => setValues({ ...values, impostoNota })}
                                                error={errors.impostoNota}
                                            />
                                        )}
                                        {values.tipoFaturamento !== null && (
                                            <FormGroupSelect
                                                disabled
                                                label="Tipo de faturamento"
                                                value={values.tipoFaturamento}
                                                setValue={(tipoFaturamento) => {
                                                    setValues({
                                                        ...values,
                                                        tipoFaturamento,
                                                        dedutiveisDistribuidor: 0,
                                                    });
                                                }}
                                                options={utils.retornaArrayTipoFaturamento()}
                                                optionTextFn={utils.retornaTextoTipoFaturamento}
                                                error={
                                                    values.tipoFaturamento
                                                        ? undefined
                                                        : "Selecione um tipo de faturamento."
                                                }
                                            />
                                        )}
                                    </div>
                                </Row>
                            </Stack>
                        );
                    }}
                </OffcanvasForm.Formik>
            </OffcanvasForm.Body>
            <OffcanvasForm.Footer>
                <OffcanvasForm.Reset>Cancelar</OffcanvasForm.Reset>
                <OffcanvasForm.Submit>{"Editar"}</OffcanvasForm.Submit>
            </OffcanvasForm.Footer>
        </OffcanvasForm.Root>
    );
}

export const yupSaleProductSchema: yup.ObjectSchema<UpdateProductSale> = yup.object({
    produtoId: yup.string().required("Selecione um produto."),
    quantidade: yup.number().min(1, "A quantidade mínima deve ser 1.").required("Este campo é necessário."),
    valorCustoUnit: yup
        .number()
        .required("Este campo é necessário.")
        .min(0.01, "O valor do custo unitário não pode ser zero."),
    tipoMoeda: yup
        .mixed<CurrencyType>()
        .oneOf(Object.values(CurrencyType))
        .transform((value) => (value === null || value === undefined ? CurrencyType.BRL : value))
        .defined("Tipo de moeda Produto é obrigatório."),
    // tipoMoeda: yup.mixed<CurrencyType>().oneOf(Object.values(CurrencyType)).defined("Selecione o tipo da moeda."),
    cotacao: yup.number().min(0.000001, "O valor da cotação não pode ser zero.").required("Este campo é necessário."),
    fornecedoresId: yup
        .array(yup.string().required("Selecione um fornecedor."))
        .required("Selecione um fornecedor.")
        .min(1, "Selecione um fornecedor"),
    //Antigos Campos
    dedutiveisDistribuidor: yup.number().defined("Este campo é obrigatório.").nullable(),
    tipoFaturamento: yup
        .mixed<RevenueType>()
        .oneOf(Object.values(RevenueType))
        .defined("Tipo Faturamento produto yup")
        .nullable(),
    impostoNota: yup.number().defined("Este campo é obrigatório.").nullable(),
    markup: yup.number().defined("Este campo é necessário.").nullable(),
});
