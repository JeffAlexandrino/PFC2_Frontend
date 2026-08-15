import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import { useCallback, useContext, useEffect, useState } from "react";
import { getUSDtoBRLRate } from "../../utils/exchange.util";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { PartialEntity, tServico } from "../../interfaces";
import { CurrencyType } from "../../types/commom";
import { Formik, FormikHelpers } from "formik";
import { Form, Row } from "react-bootstrap";

import SelectTipoProdutoServico from "../selects/SelectTipoProdutoServico";
import FormGroupGeneric from "../formGroups/FormGroupGeneric";
import FormGroupSelect from "../formGroups/FormGroupSelect";
import utils from "../../utils";

import * as yup from "yup";

//TYPE
export type tNovoServico = PartialEntity<
    tServico,
    "name" | "observacoes" | "tipoMoeda" | "tipoProdutoServicoId" | "valorCustoHora"
>;

interface IFormServicoProps {
    formId?: string;
    onSubmit: (servico: tNovoServico) => void | Promise<void>;
    valoresIniciais: tNovoServico;
}

//FORM
export default function FormServico(props: IFormServicoProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //VARIAVEIS
    const { onSubmit, valoresIniciais, formId } = props;

    //EVENTOS
    const onSubmitFormik = useCallback(
        async (servico: tNovoServico, helpers: FormikHelpers<tNovoServico>) => {
            try {
                await onSubmit(servico);
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
                        label="Nome do serviço"
                        type={FormGroupInputType.TEXT}
                        value={values.name}
                        setValue={(name) => setValues({ ...values, name })}
                        error={errors.name}
                    />
                    <FormGroupSelect
                        label="Moeda"
                        value={values.tipoMoeda}
                        sm="4"
                        setValue={(tipoMoeda) => setValues({ ...values, tipoMoeda })}
                        options={utils.retornaArrayTipoMoeda()}
                        optionTextFn={utils.retornaTextoTipoMoeda}
                        error={errors.tipoMoeda}
                    />
                    <FormGroupInput
                        label="Custo por hora"
                        sm="7"
                        type={FormGroupInputType.MONETARY}
                        tipoMoeda={values.tipoMoeda}
                        value={values.valorCustoHora}
                        setValue={(valorCustoHora) => setValues({ ...values, valorCustoHora })}
                        error={errors.valorCustoHora}
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
                                        {values.valorCustoHora != null && !isNaN(Number(values.valorCustoHora)) && (
                                            <span>
                                                {" — Equivalente: R$ "}
                                                {((Number(values.valorCustoHora) || 0) * exchangeRate).toLocaleString(
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
                    <FormGroupInput
                        label="Observações"
                        type={FormGroupInputType.TEXT_AREA}
                        rows={4}
                        max={256}
                        value={values.observacoes}
                        setValue={(observacoes) => setValues({ ...values, observacoes })}
                        error={errors.observacoes}
                    />
                    <FormGroupGeneric label="Tipo de Produto/Serviço" error={errors.tipoProdutoServicoId}>
                        <SelectTipoProdutoServico
                            idSelecionado={values.tipoProdutoServicoId}
                            setIdSelecionado={(id) => setValues({ ...values, tipoProdutoServicoId: id ?? "" })}
                        />
                    </FormGroupGeneric>
                </Row>
            </Form>
        );
    };

    return (
        <Formik
            validateOnChange={false}
            validationSchema={yupEsquemaServico}
            onSubmit={onSubmitFormik}
            initialValues={valoresIniciais}
        >
            {(formikProps) => <FormBody {...formikProps} />}
        </Formik>
    );
}

export const yupEsquemaServico: yup.ObjectSchema<tNovoServico> = yup.object({
    name: yup.string().required("Campo necessário.").max(256, "Deve ter no máximo 256 carecteres."),
    valorCustoHora: yup
        .number()
        .defined()
        .required("Campo necessário.")
        .min(0.01, "O valor mínimo deve ser maior que 0.01"),
    tipoMoeda: yup.mixed<CurrencyType>().oneOf(Object.values(CurrencyType)).required("Campo necessário"),
    observacoes: yup.string().required("Adicione uma observação."),
    tipoProdutoServicoId: yup.string().required("Selecione um tipo."),
});
