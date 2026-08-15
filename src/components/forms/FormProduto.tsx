import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import { useCallback, useContext, useEffect, useState } from "react";
import { getUSDtoBRLRate } from "../../utils/exchange.util";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { PartialEntity, tProduto } from "../../interfaces";
import { CurrencyType } from "../../types/commom";
import { Formik, FormikHelpers } from "formik";
import { Form, Row } from "react-bootstrap";

import SelectTipoProdutoServico from "../selects/SelectTipoProdutoServico";
import FormGroupGeneric from "../formGroups/FormGroupGeneric";
import FormGroupSelect from "../formGroups/FormGroupSelect";
import SelectFabricante from "../selects/SelectFabricante";
import SelectCategoria from "../selects/SelectCategoria";
import utils from "../../utils";

import * as yup from "yup";

//TYPES
export type tNovoProduto = PartialEntity<
    tProduto,
    "categoriaId" | "fabricanteId" | "name" | "custoUnit" | "partNumber" | "tipoProdutoServicoId" | "tipoMoeda"
>;

interface IFormProdutoProps {
    formId?: string;
    onSubmit: (produto: tNovoProduto) => void | Promise<void>;
    valoresIniciais: tNovoProduto;
}

//FORM
export default function FormProduto(props: IFormProdutoProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //VARIAVEIS
    const { onSubmit, valoresIniciais, formId } = props;

    //EVENTOS
    const onSubmitFormik = useCallback(
        async (produto: tNovoProduto, helpers: FormikHelpers<tNovoProduto>) => {
            try {
                await onSubmit(produto);
                helpers.setSubmitting(false);
                helpers.resetForm();
            } catch (err) {
                if (utils.blErroCancelamento(err)) return;
                setPerigo(utils.retornaMensagemErro(err));
                console.error(err);
            }
        },
        [onSubmit, setPerigo]
    );

    const FormBody = (formikProps: any) => {
        const { handleSubmit, values, errors, setValues } = formikProps;
        const [exchangeRate, setExchangeRate] = useState<number | null>(null);
        const [loadingRate, setLoadingRate] = useState(false);

        useEffect(() => {
            let mounted = true;
            async function fetchRate() {
                try {
                    setLoadingRate(true);
                    const rate = await getUSDtoBRLRate();
                    if (mounted) setExchangeRate(rate);
                } catch (e) {
                    if (mounted) setExchangeRate(null);
                } finally {
                    if (mounted) setLoadingRate(false);
                }
            }

            if (values.tipoMoeda === CurrencyType.USD) {
                fetchRate();
            } else {
                setExchangeRate(null);
            }

            return () => {
                mounted = false;
            };
        }, [values.tipoMoeda]);

        return (
            <Form id={formId} onSubmit={handleSubmit}>
                <Row className="gap-3">
                    <FormGroupInput
                        label="Nome do produto"
                        required
                        type={FormGroupInputType.TEXT}
                        value={values.name}
                        setValue={(name) => setValues({ ...values, name })}
                        error={errors.name}
                    />
                    <FormGroupInput
                        label="PartNumber do produto"
                        required
                        type={FormGroupInputType.TEXT}
                        value={values.partNumber}
                        setValue={(partNumber) => setValues({ ...values, partNumber })}
                        error={errors.partNumber}
                    />
                    <FormGroupSelect
                        label="Moeda"
                        sm="4"
                        value={values.tipoMoeda || CurrencyType.BRL}
                        setValue={(tipoMoeda) => setValues({ ...values, tipoMoeda })}
                        options={utils.retornaArrayTipoMoeda()}
                        optionTextFn={utils.retornaTextoTipoMoeda}
                        error={errors.tipoMoeda}
                    />
                    <FormGroupInput
                        label="Custo Unitário"
                        sm="7"
                        required
                        type={FormGroupInputType.MONETARY}
                        tipoMoeda={values.tipoMoeda ?? CurrencyType.BRL}
                        value={values.custoUnit}
                        setValue={(custoUnit) => setValues({ ...values, custoUnit })}
                        error={errors.custoUnit}
                    />
                    {values.tipoMoeda === CurrencyType.USD && (
                        <div className="mt-1 mb-2">
                            <small className="text-muted">
                                {loadingRate && "Buscando cotação..."}
                                {!loadingRate && exchangeRate != null && (
                                    <>
                                        Cotação: R${" "}
                                        {exchangeRate.toLocaleString("pt-BR", {
                                            minimumFractionDigits: 4,
                                            maximumFractionDigits: 4,
                                        })}
                                        {values.custoUnit != null && !isNaN(Number(values.custoUnit)) && (
                                            <span>
                                                {" — Equivalente: R$ "}
                                                {((Number(values.custoUnit) || 0) * exchangeRate).toLocaleString(
                                                    "pt-BR",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </span>
                                        )}
                                    </>
                                )}
                                {!loadingRate && exchangeRate == null && "Não foi possível obter a cotação."}
                            </small>
                        </div>
                    )}
                    <FormGroupGeneric label="Fabricante" error={errors.fabricanteId}>
                        <SelectFabricante
                            setIdSelecionado={(id) => setValues({ ...values, fabricanteId: id ?? "" })}
                            idSelecionado={values.fabricanteId}
                        ></SelectFabricante>
                    </FormGroupGeneric>
                    <FormGroupGeneric label="Tipo de Produto/Serviço" error={errors.tipoProdutoServicoId}>
                        <SelectTipoProdutoServico
                            setIdSelecionado={(id) => setValues({ ...values, tipoProdutoServicoId: id ?? "" })}
                            idSelecionado={values.tipoProdutoServicoId}
                        />
                    </FormGroupGeneric>
                    <FormGroupGeneric label="Categoria do produto" error={errors.categoriaId}>
                        <SelectCategoria
                            setIdSelecionado={(id) => setValues({ ...values, categoriaId: id ?? "" })}
                            idSelecionado={values.categoriaId}
                        />
                    </FormGroupGeneric>
                </Row>
            </Form>
        );
    };

    return (
        <Formik
            validateOnChange={false}
            validationSchema={yupEsquemaProduto}
            onSubmit={onSubmitFormik}
            initialValues={valoresIniciais}
        >
            {(formikProps) => <FormBody {...formikProps} />}
        </Formik>
    );
}

export const yupEsquemaProduto: yup.ObjectSchema<tNovoProduto> = yup.object({
    name: yup.string().required("Campo necessário.").max(256, "Deve ter no máximo 256 carecteres."),
    partNumber: yup
        .string()
        .defined()
        .required("Campo necessário.")
        .min(1, "Deve ter no mínimo 1 caracteres.")
        .max(50, "Deve ter no máximo 50 carecteres."),
    categoriaId: yup.string().required("Selecione uma categoria."),
    tipoProdutoServicoId: yup.string().required("Selecione um tipo."),
    custoUnit: yup.number().defined().required("Campo necessário.").min(0.01, "O valor deve ser maior que 0.01"),
    fabricanteId: yup.string().required("Selecione um fabricante."),
    tipoMoeda: yup.mixed<CurrencyType>().oneOf(Object.values(CurrencyType)).required("Selecione um tipo de moeda."),
});
